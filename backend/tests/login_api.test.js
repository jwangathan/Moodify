const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const axios = require('axios');
const { generateCode, generateRandomString } = require('../utils/loginService');

const api = supertest(app);

afterAll(async () => {
	await mongoose.connection.close();
});

describe('Login API', () => {
	test.skip('GET /auth/login - generates login URL', async () => {
		const res = await api.get('/auth/login').expect(200);

		expect(res.text).toContain('https://accounts.spotify.com/authorize');
	});

	test.skip('GET /auth/callback - handles login callback and retrieves tokens', async () => {
		const mockCode = 'mockSpotifyCode';
		const mockVerifier = 'mockVerifier';

		api.set('Cookie', `codeVerifier=${mockVerifier}`);

		const res = await api.get(`/auth/callback?code=${mockCode}`).expect(200);

		expect(res.body).toHaveProperty('token');
		expect(res.body).toHaveProperty('expiresAt');
		expect(res.body).toHaveProperty('topArtists');
		expect(res.body).toHaveProperty('topGenres');
		expect(res.body).toHaveProperty('topTracks');
		expect(res.body).toHaveProperty('user');
	});
});
