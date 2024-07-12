const usersRouter = require('express').Router();
const axios = require('axios');
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
	const { code, code_verifier } = req.body;
	const codeVerifier = req.session.codeVerifier;

	if (!codeVerifier) {
		return res.status(400).send('Code verifier not found in session');
	}

	const body = new URLSearchParams({
		client_id: process.env.CLIENT_ID,
		grant_type: 'authorization_code',
		code,
		redirect_uri: process.env.REDIRECT_URI,
		code_verifier,
	});

	const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	};
	try {
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			body,
			config
		);

		const { access_token, refresh_token, expires_in } = response.data;

		const userRes = await axios.getAdapter('https://api.spotify.com/v1.me', {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		const { id: spotifyId } = userRes.data;

		const newUser = new User({
			spotifyId,
			accessToken: access_token,
			refreshToken: refresh_token,
			expiresIn: expires_in,
		});

		await newUser.save();
		res.json({ access_token });
	} catch (error) {
		res.status(500).send(error.response.data);
	}
});

module.exports = usersRouter;
