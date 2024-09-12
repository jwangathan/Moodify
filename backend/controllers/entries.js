const entryRouter = require('express').Router();
const Entry = require('../models/entry');
const { model } = require('../utils/config');
const {
	toJSON,
	getRecommendations,
	createPlaylist,
	addTracksToPlaylist,
	removeTracksFromPlaylist,
} = require('../utils/playlistService');

//retrieves entries by current user
entryRouter.get('/', async (req, res) => {
	const user = req.user;

	const entries = await Entry.find({ user: user._id }).populate('user', {
		spotifyId: 1,
	});

	res.json(entries);
});

//retrieves specific entry
entryRouter.get('/:id', async (req, res) => {
	const entry = await Entry.findById(req.params.id);
	if (entry) {
		res.json(entry);
	} else {
		res.status(404).end();
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
			recommendations: {
				seedTracks: seed_tracks,
				seedArtists: seed_artists,
				seedGenres: seed_genres,
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
			},
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
		if (!targetEntry.playlist || !targetEntry.playlist.id) {
			const newPlaylist = await createPlaylist(
				user.spotifyId,
				targetEntry.emotion,
				token
			);

			const { snapshot_id: snapshot } = await addTracksToPlaylist(
				newPlaylist.id,
				selectedTracks,
				token
			);
			console.log(snapshot);

			targetEntry.playlist = {
				id: newPlaylist.id,
				snapshot: snapshot,
				name: newPlaylist.name,
				tracks: selectedTracks,
				url: newPlaylist.external_urls.spotify,
				image: newPlaylist.images.url,
			};

			await targetEntry.save();

			console.log('CREATED');
			return res.status(201).json({
				message: 'Playlist created and songs added to Spotify',
				id,
				playlist: targetEntry.playlist,
			});
		} else {
			const oldSelectedSongs = targetEntry.playlist.tracks;
			const songsToAdd = selectedTracks.filter(
				(song) => !oldSelectedSongs.includes(song)
			);
			const songsToDelete = oldSelectedSongs.filter(
				(song) => !selectedTracks.includes(song)
			);

			let snapshot = targetEntry.playlist.snapshot;

			if (songsToAdd.length > 0)
				({ snapshot_id: snapshot } = await addTracksToPlaylist(
					targetEntry.playlist.id,
					songsToAdd,
					token
				));

			if (songsToDelete.length > 0)
				({ snapshot_id: snapshot } = await removeTracksFromPlaylist(
					targetEntry.playlist.id,
					songsToDelete,
					snapshot,
					token
				));

			targetEntry.playlist.tracks = selectedTracks;
			targetEntry.playlist.snapshot = snapshot;

			newEntry = await targetEntry.save();
			console.log('UPDATED');
			return res.status(201).json({
				message: 'Playlist updated in Spotify and saved to database',
				id,
				playlist: targetEntry.playlist,
			});
		}
	} catch (error) {
		console.error('Error processing playlist update: ', error);
		return res.status(500).json({ error: 'Failed to update playlist' });
	}
});

module.exports = entryRouter;
