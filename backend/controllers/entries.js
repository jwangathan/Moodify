const entryRouter = require('express').Router();
const Entry = require('../models/entry');
const { model } = require('../utils/config');
const middleware = require('../utils/middleware');
const axios = require('axios');

const toJSON = (res) => {
	const trimmed = res.replace(/```/g, '').replace('json', '');
	const jsonData = JSON.parse(trimmed);
	return jsonData;
};

const getRecommendations = async (
	seed_artists,
	seed_genres,
	seed_tracks,
	attributes,
	token
) => {
	const {
		acousticness,
		danceability,
		energy,
		instrumentalness,
		liveness,
		loudness,
		popularity,
		speechiness,
		tempo,
		valence,
	} = attributes;
	const params = {
		limit: 20,
		seed_artists, //missing 2
		seed_genres, //missing 2,
		seed_tracks, //missing 1,
		target_acousticness: acousticness,
		target_danceability: danceability,
		target_energy: energy,
		target_instrumentalness: instrumentalness,
		target_liveness: liveness,
		target_loudness: loudness,
		target_popularity: popularity,
		target_speechiness: speechiness,
		target_tempo: tempo,
		target_valence: valence,
	};

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: params,
	};

	try {
		const response = await axios.get(
			'https://api.spotify.com/v1/recommendations',
			config
		);

		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

entryRouter.get('/', middleware.userExtractor, async (req, res) => {
	const user = req.user;

	const entries = await Entry.find({ user: user._id }).populate('user', {
		spotifyId: 1,
	});

	res.json(entries);
});

entryRouter.get('/:id', async (req, res) => {
	const entry = await Blog.findById(req.params.id);
	if (entry) {
		res.json(entry);
	} else {
		res.status(404).end();
	}
});

entryRouter.post('/', middleware.userExtractor, async (req, res) => {
	const user = req.user;
	const token = req.token;
	const { seed_artists, seed_tracks, seed_genres, situation, emotion } =
		req.body;
	try {
		const prompt = `User situation: ${situation}\nDesired emotion: ${emotion}\nProvide suitable values on the given scale for acousticness (0.0-1.0), danceability (0.0-1.0), energy(0.0-1.0), instrumentalness(0.0-1.0), liveness(0.0-1.0), loudness(dB), popularity(0-100), speechiness(0.0-1.0), tempo(BPM), and valence(0.0-1.0). Give me ONLY the JSON values.`;
		const result = await model.generateContent(prompt);
		const response = await result.response;
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

module.exports = entryRouter;
