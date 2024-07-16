const loginRouter = require('express').Router();
const axios = require('axios');
const User = require('../models/user');

const generateCode = async () => {
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const randomValues = crypto.getRandomValues(new Uint8Array(64));
	const randomString = randomValues.reduce(
		(acc, x) => acc + possible[x % possible.length],
		''
	);

	const code_verifier = randomString;
	const data = new TextEncoder().encode(code_verifier);
	const hashed = await crypto.subtle.digest('SHA-256', data);
	const code_challenge_base64 = btoa(
		String.fromCharCode(...new Uint8Array(hashed))
	)
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
	return { code_verifier, code_challenge_base64 };
};

loginRouter.get('/login', async (req, res) => {
	const { code_verifier, code_challenge_base64 } = await generateCode();
	req.session.codeVerifier = code_verifier;
	const authUrl = new URL(process.env.AUTH_ENDPOINT);
	const params = {
		response_type: 'code',
		client_id: process.env.CLIENT_ID,
		scope: process.env.SCOPE,
		code_challenge_method: 'S256',
		code_challenge: code_challenge_base64,
		redirect_uri: `${process.env.SERVER_URL}/api/auth/callback`,
	};
	authUrl.search = new URLSearchParams(params).toString();
	res.send(authUrl.toString());
});

loginRouter.get('/callback', (req, res) => {
	const code = req.query.code;
	const code_verifier = req.session.codeVerifier;

	if (!code_verifier) {
		return res.status(400).send('Code verifier not found in session');
	}

	const body = new URLSearchParams({
		client_id: process.env.CLIENT_ID,
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: `${process.env.SERVER_URL}/api/auth/callback`,
		code_verifier: code_verifier,
	});

	const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	};

	axios
		.post('https://accounts.spotify.com/api/token', body, config)
		.then((response) => {
			const { access_token, refresh_token, expires_in } = response.data;
			axios
				.get('https://api.spotify.com/v1/me', {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				})
				.then(async (response) => {
					const spotifyId = response.data.id;

					await User.findOneAndUpdate(
						{ spotifyId },
						{
							spotifyId,
							accessToken: access_token,
							refreshToken: refresh_token,
							expiresIn: expires_in,
						},
						{ new: true, upsert: true }
					);

					res.redirect(
						`${process.env.CLIENT_URL}/survey?token=${access_token}`
					);
				})
				.catch((error) => {
					res.status(500).send(error.response.data);
				});
		})
		.catch((error) => {
			res.status(500).send(error.response.data);
		});
});

module.exports = loginRouter;
