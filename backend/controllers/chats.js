const chatRouter = require('express').Router();
const User = require('../models/user');
const Chat = require('../models/chat');
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

chatRouter.get('/', async (req, res) => {
	const chats = await Chat.find({}).populate('user', { spotifyId: 1 });
	res.json(chats);
});

chatRouter.get('/:id', async (req, res) => {
	const chat = await Blog.findByeId(request.params.id);
	if (chat) {
		res.json(chat);
	} else {
		res.status(404).end();
	}
});

chatRouter.post('/', middleware.userExtractor, async (req, res) => {
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

		const chat = new Chat({
			user: user._id,
			situation,
			emotion,
			attributes: chatResponse,
			recommendations: {
				seedTracks: seed_tracks,
				seedArtists: seed_artists,
				seedGenres: seed_genres,
				recommendedTracks: recommendations.tracks.map((track) => ({
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

		await chat.populate('user', { spotifyId: 1 });
		const savedChat = await chat.save();

		user.chatHistory = user.chatHistory.concat(savedChat._id);
		await user.save();

		res.status(201).json({ savedChat, recommendations });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error });
	}
});

module.exports = chatRouter;
