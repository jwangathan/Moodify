const entryRouter = require('express').Router();
const Entry = require('../models/entry');
const User = require('../models/user');
const { model } = require('../utils/config');
const {
	toJSON,
	getRecommendations,
	arraysNotEqual,
	getPlaylist,
	createPlaylist,
	updatePlaylist,
} = require('../utils/playlistService');

//retrieves entries by current user
entryRouter.get('/', async (req, res) => {
	const user = req.user;

	const entries = await Entry.find({ user: user._id }).populate('user', {
		spotifyId: 1,
	});

	res.status(200).json(entries);
});

//retrieves specific entry
entryRouter.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const entry = await Entry.findById(id).exec();
		if (!entry) {
			return res.status(404).json({ error: `Entry not found with ID ${id}` });
		}
		if (entry.user.toString() !== req.user.id.toString()) {
			return res
				.status(401)
				.json({ error: 'You are not authorized to view this entry' });
		}
		//if a playlist exists, check it
		if (entry.playlist.id) {
			try {
				const {
					exists,
					playlist: { id, snapshot_id, tracks },
				} = await getPlaylist(entry.playlist.id, req.token);

				if (!exists) {
					entry.playlist = { id: null, snapshot: null, selectedTracks: [] };
					await entry.save();
					return res.json({ updated: true, id: entry.id, entry });
				}
				const selectedTracks = tracks.items.map((t) => t.track.id);
				const includedTracks = entry.tracks.map((t) => t.id);
				const matchingTracks = selectedTracks.filter((t) =>
					includedTracks.includes(t)
				);

				//if the values are different, update them
				if (
					snapshot_id !== entry.playlist.snapshot &&
					arraysNotEqual(matchingTracks, entry.playlist.selectedTracks)
				) {
					entry.playlist = {
						id,
						snapshot: snapshot_id,
						selectedTracks: matchingTracks,
					};
					await entry.save();
					return res.status(200).json({ updated: true, id: entry.id, entry });
				}
			} catch (err) {
				console.error('Error retrieving playlist: ', err.response?.data || err);
				return res.status(500).json({ error: 'Error retrieving playlist' });
			}
		}

		return res.status(200).json({ updated: false, id: entry.id, entry });
	} catch (err) {
		return res.status(500).json({ error: 'Error retrieving/updating entry' });
	}
});

//creates entry and gathers recommendations
entryRouter.post('/', async (req, res) => {
	const user = req.user;
	const token = req.token;
	const { seed_artists, seed_tracks, seed_genres, situation, emotion } =
		req.body;
	try {
		const prompt = `User situation: ${situation}\nDesired emotion: ${emotion}\nProvide suitable values on the given scale for acousticness (0.0-1.0), danceability (0.0-1.0), energy(0.0-1.0), instrumentalness(0.0-1.0), liveness(0.0-1.0), loudness(dB), popularity(0-100), speechiness(0.0-1.0), tempo(BPM), and valence(0.0-1.0). Give me ONLY the JSON values.`;
		const result = await model.generateContent(prompt);
		const response = result.response;
		const chatResponse = response.text();
		const attributes = toJSON(chatResponse);
		if (!attributes) {
			return res.status(500).json({ message: 'Error parsing Gemini response' });
		}
		const recommendations = await getRecommendations(
			seed_artists,
			seed_genres,
			seed_tracks,
			attributes,
			token
		);

		if (!recommendations) {
			return res
				.status(500)
				.json({ message: 'Error producing song recommendations' });
		}

		const entry = new Entry({
			user: user._id,
			situation,
			emotion,
			attributes: chatResponse,
			tracks: recommendations.tracks.map((track) => ({
				id: track.id,
				name: track.name,
				artists: track.artists.map((artist) => ({
					id: artist.id,
					name: artist.name,
				})),
				album: {
					id: track.album.id,
					name: track.album.name,
					image: track.album.images[0].url,
				},
				previewUrl: track.preview_url,
				externalUrl: track.external_urls.spotify,
			})),
		});

		await entry.populate('user', { spotifyId: 1 });
		const savedEntry = await entry.save();

		user.entryHistory = user.entryHistory.concat(savedEntry._id);
		await user.save();

		res.status(201).json(savedEntry);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
});

//creates playlist and updates playlist information
entryRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { selectedTracks } = req.body;
	const token = req.token;
	const user = req.user;

	if (!Array.isArray(selectedTracks)) {
		return res.status(400).json({ error: 'Selected songs should be an array' });
	}

	try {
		const targetEntry = await Entry.findById(id).exec();

		if (!targetEntry) {
			return res.status(404).json({ error: 'Entry not found' });
		}

		//check if playlist exists
		if (targetEntry.playlist && targetEntry.playlist.id) {
			const playlistId = targetEntry.playlist.id;
			const playlist = await getPlaylist(playlistId, token);
			if (!playlist.exists) {
				targetEntry.playlist = {
					id: null,
					snapshot: null,
					selectedTracks: [],
					url: null,
				};
				await targetEntry.save();
			}
		}

		if (!targetEntry.playlist || !targetEntry.playlist.id) {
			const newPlaylist = await createPlaylist(
				user.spotifyId,
				user.displayName,
				targetEntry.emotion,
				token
			);

			const { snapshot_id: snapshot } = await updatePlaylist(
				newPlaylist.id,
				selectedTracks,
				token
			);

			targetEntry.playlist = {
				id: newPlaylist.id,
				snapshot: snapshot,
				selectedTracks: selectedTracks,
				url: newPlaylist.external_urls.spotify,
			};

			await targetEntry.save();

			return res.status(201).json({
				message: 'Playlist created and songs added to Spotify',
				id,
				entry: targetEntry,
			});
		} else {
			const { snapshot_id: snapshot } = await updatePlaylist(
				targetEntry.playlist.id,
				selectedTracks,
				token
			);

			targetEntry.playlist.selectedTracks = selectedTracks;
			targetEntry.playlist.snapshot = snapshot;

			await targetEntry.save();

			return res.status(201).json({
				message: 'Playlist updated in Spotify and saved to database',
				id,
				entry: targetEntry,
			});
		}
	} catch (error) {
		console.error('Error processing playlist update: ', error);
		return res.status(500).json({ error: 'Failed to update playlist' });
	}
});

entryRouter.delete('/:id', async (req, res) => {
	const user = req.user;

	const entry = await Entry.findById(req.params.id);
	if (!entry) {
		return res.status(404).json({ error: 'Entry not found' });
	}

	if (entry.user.toString() !== user.id.toString()) {
		return res
			.status(401)
			.json({ error: 'You are not authorized to delete this entry' });
	}

	await User.findByIdAndUpdate(user.id, {
		$pull: { entryHistory: req.params.id },
	});

	await Entry.findByIdAndDelete(req.params.id);
	res.status(204).end();
});

module.exports = entryRouter;
