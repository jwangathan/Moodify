const loginRouter = require('express').Router();
const axios = require('axios');
const User = require('../models/user');
const baseURL = 'https://api.spotify.com/v1';
const { generateCode, generateRandomString } = require('../utils/loginService');

loginRouter.get('/login', async (req, res) => {
	const { code_verifier, code_challenge_base64 } = await generateCode();
	const state = generateRandomString(16);

	res.cookie('codeVerifier', code_verifier, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 600000,
	});

	const authUrl = new URL('https://accounts.spotify.com/authorize');
	const params = {
		response_type: 'code',
		client_id: process.env.CLIENT_ID,
		scope:
			'user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public playlist-read-private',
		state,
		code_challenge_method: 'S256',
		code_challenge: code_challenge_base64,
		redirect_uri: `${process.env.CLIENT_URL}/auth/callback`,
	};
	authUrl.search = new URLSearchParams(params).toString();
	res.status(200).send(authUrl.toString());
});

loginRouter.get('/callback', async (req, res) => {
	const code = req.query.code;
	const code_verifier = req.cookies.codeVerifier;

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

		const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

		const userRes = await axios.get(`${baseURL}/me`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		const { id: spotifyId, display_name, images } = userRes.data;

		let profileImage;
		if (images && images.length > 0) {
			profileImage = images.sort(
				(a, b) => b.width * b.height - a.width * a.height
			)[0].url;
		} else {
			profileImage = '';
		}

		const topArtistsRes = await axios.get(`${baseURL}/me/top/artists`, {
			headers: { Authorization: `Bearer ${access_token}` },
			params: { limit: 20 },
		});

		const topArtists = topArtistsRes.data.items.map((artist) => ({
			id: artist.id,
			name: artist.name,
			genres: artist.genres,
			url: artist.external_urls.spotify,
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
			url: track.external_urls.spotify,
		}));

		await User.findOneAndUpdate(
			{ spotifyId },
			{
				spotifyId,
				accessToken: access_token,
				refreshToken: refresh_token,
				expiresAt,
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
			expiresAt,
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
	const user = await User.findOne({ spotifyId });

	if (!user) return res.status(404).json({ error: 'User not found' });

	if (!user.refreshToken)
		return res.status(401).json({ error: 'Refresh token not found' });

	try {
		const body = new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: user.refreshToken,
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

		const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

		await User.findOneAndUpdate(
			{ spotifyId },
			{
				accessToken: access_token,
				refreshToken: refresh_token || refreshToken,
				expiresAt,
			}
		);

		res.status(200).json({
			token: access_token,
			expiresAt,
		});
	} catch (error) {
		console.error('Error refreshing access token: ', error.response.data);
		res.status(500).json({ error: 'Failed to refresh access token' });
	}
});

module.exports = loginRouter;
