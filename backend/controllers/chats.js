const axios = require('axios');
const chatRouter = require('express').Router();
const User = require('../models/user');
const Chat = require('../models/chat');

const toJSON = (res) => {
	const attributes = {};
	const regex = /(\w+):\s*([0-9.]+)/g;
	let match;
	while ((match = regex.exec(res)) !== null) {
		attributes[match[1]] = parseFloat(match[2]);
	}

	return attributes;
};

const getRecommendations = async (attributes, token) => {
	const {
		acousticness,
		danceability,
		energy,
		instrumentalness,
		key,
		liveness,
		loudness,
		popularity,
		speechiness,
		tempo,
		time_signature,
		valence,
	} = attributes;

	const params = {
		limit: 20,
		seed_artists: '', //missing 2
		seed_genres: '', //missing 2,
		seed_tracks: '', //missing 1,
		target_acousticness: acousticness,
		target_danceability: danceability,
		target_energy: energy,
		target_instrumentalness: instrumentalness,
		target_key: key,
		target_liveness: liveness,
		target_loudness: loudness,
		target_popularity: popularity,
		target_speechiness: speechiness,
		target_tempo: tempo,
		target_time_signature: time_signature,
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
		return null;
	}
};

chatRouter.post('/', async (req, res) => {
	const { spotifyId, situation, emotion, token } = req.body;

	try {
		const user = await User.findOne({ spotifyId });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const prompt = `User situation: ${situation}\nDesired emotion: ${emotion}\nProvide suitable values on the given scale for acousticness (0.0-1.0), danceability (0.0-1.0), energy(0.0-1.0), instrumentalness(0.0-1.0), liveness(0.0-1.0), loudness(dB), popularity(0-100), speechiness(0.0-1.0), tempo(BPM), and valence(0.0-1.0). Give it in JSON format.`;
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{ model: 'gpt-4', messages: [{ role: 'user', content: prompt }] },
			{
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const chatResponse = response.data.choices[0].message.content;
		const chat = new Chat({
			user: user.spotifyId,
			situation,
			emotion,
			chatResponse,
		});

		await chat.populate('user', { spotifyId: 1 });
		const savedChat = await chat.save();

		user.chatHistory = user.chatHistory.concat(savedChat._id);
		await user.save();

		const attributes = toJSON(chatResponse);

		if (!attributes) {
			return res
				.status(500)
				.json({ message: 'Error parsing ChatGPT response' });
		}

		const recommendations = await getRecommendations(attributes, token);

		res.status(201).json({ savedChat, recommendations });
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
});

module.exports = chatRouter;
