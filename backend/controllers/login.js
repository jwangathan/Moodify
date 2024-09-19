const loginRouter = require('express').Router();
const axios = require('axios');
const User = require('../models/user');
const baseURL = 'https://api.spotify.com/v1';
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'Lax',
};

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

const generateRandomString = (length) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

loginRouter.get('/login', async (req, res) => {
	const { code_verifier, code_challenge_base64 } = await generateCode();
	const state = generateRandomString(16);
	req.session.codeVerifier = code_verifier;
	const authUrl = new URL('https://accounts.spotify.com/authorize');
	const params = {
		response_type: 'code',
		client_id: process.env.CLIENT_ID,
		scope:
			'user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public',
		state,
		code_challenge_method: 'S256',
		code_challenge: code_challenge_base64,
		redirect_uri: `${process.env.CLIENT_URL}/auth/callback`,
	};
	authUrl.search = new URLSearchParams(params).toString();
	res.send(authUrl.toString());
});

loginRouter.get('/callback', async (req, res) => {
	const code = req.query.code;
	const code_verifier = req.session.codeVerifier;

	if (!code_verifier) {
		return res.status(400).send('Code verifier not found in session');
	}

	const body = new URLSearchParams({
		client_id: process.env.CLIENT_ID,
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: `${process.env.CLIENT_URL}/auth/callback`,
		code_verifier: code_verifier,
	});

	const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	};

	try {
		const tokenRes = await axios.post(
			'https://accounts.spotify.com/api/token',
			body,
			config
		);

		const { access_token, refresh_token, expires_in } = tokenRes.data;

		const userRes = await axios.get(`${baseURL}/me`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		const { id: spotifyId, display_name, images } = userRes.data;
		const profileImage = images.length > 0 ? images[0].url : '';

		const topArtistsRes = await axios.get(`${baseURL}/me/top/artists`, {
			headers: { Authorization: `Bearer ${access_token}` },
			params: { limit: 20 },
		});

		const topArtists = topArtistsRes.data.items.map((artist) => ({
			id: artist.id,
			name: artist.name,
			genres: artist.genres,
		}));

		const genreCounts = {};

		topArtists.forEach((artist) => {
			artist.genres.forEach((genre) => {
				genreCounts[genre] = (genreCounts[genre] || 0) + 1;
			});
		});

		const sortedGenres = Object.keys(genreCounts).sort(
			(a, b) => genreCounts[b] - genreCounts[a]
		);

		const topGenres = sortedGenres.slice(0, 10);

		const topTracksResponse = await axios.get(`${baseURL}/me/top/tracks`, {
			headers: { Authorization: `Bearer ${access_token}` },
			params: { limit: 10 },
		});

		const topTracks = topTracksResponse.data.items.map((track) => ({
			id: track.id,
			name: track.name,
			artists: track.artists.map((artist) => artist.name),
		}));

		await User.findOneAndUpdate(
			{ spotifyId },
			{
				spotifyId,
				accessToken: access_token,
				refreshToken: refresh_token,
				expiresIn: Math.floor(Date.now() / 1000) + expires_in,
				profileImage: profileImage,
				displayName: display_name,
				topArtists: topArtists.slice(0, 10),
				topTracks,
				topGenres,
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true }
		);

		res.status(200).json({
			token: access_token,
			expiresIn: expires_in,
			topArtists: topArtists.slice(0, 10),
			topGenres,
			topTracks,
			user: {
				spotifyId,
				displayName: display_name,
				profileImage,
			},
		});
	} catch (error) {
		console.log('Error during Spotify token exchange: ', error.response.data);
		res.status(500).send('Token exchange failed');
	}
});

loginRouter.post('/refresh', async (req, res) => {
	const { spotifyId } = req.body;
	const { refreshToken } = await User.findOne({ spotifyId });

	if (!refreshToken)
		return res.status(401).json({ error: 'Refresh token not found' });

	try {
		const body = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: process.env.CLIENT_ID,
		});

		const params = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};

		const newRefresh = await axios.post(
			'https://accounts.spotify.com/api/token',
			body,
			params
		);

		const { access_token, refresh_token, expires_in } = newRefresh.data;

		const user = await User.findOne({ refreshToken });

		if (!user) return res.status(404).json({ error: 'User not found' });

		await User.findOneAndUpdate(
			{ spotifyId },
			{
				accessToken: access_token,
				refreshToken: newRefresh.data.refresh_token || refreshToken,
				expiresIn: expires_in,
			}
		);

		res.status(200).json({
			token: access_token,
			expiresIn: expires_in,
		});
	} catch (error) {
		console.error('Error refreshing access token: ', error.response.data);
		res.status(500).json({ error: 'Failed to refresh access token' });
	}
});

module.exports = loginRouter;
