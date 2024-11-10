const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const axios = require('axios');
const api = supertest(app);

jest.mock('axios');

describe('Login API', () => {
	beforeEach(async () => {
		axios.get.mockReset();
		axios.post.mockReset();
	});

	afterEach(async () => {
		await User.deleteMany({});
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	it('GET /auth/login - generates login URL', async () => {
		const res = await api.get('/api/auth/login').expect(200);

		expect(res.text).toContain('https://accounts.spotify.com/authorize');
	});

	it('GET /auth/callback - handles login callback and retrieves tokens', async () => {
		const mockCode = 'mockSpotifyCode';
		const mockVerifier = 'mockVerifier';

		axios.post.mockResolvedValueOnce({
			data: {
				access_token: 'mockAccessToken',
				refresh_token: 'mockRefreshToken',
				expires_in: 3600,
			},
		});

		axios.get.mockResolvedValueOnce({
			data: {
				id: 'mockSpotifyId',
				display_name: 'Mock User',
				images: [
					{ url: 'mockProfileImageL', height: 300, width: 300 },
					{ url: 'mockProfileImageM', height: 150, widht: 150 },
				],
			},
		});

		axios.get.mockResolvedValueOnce({
			data: {
				items: [
					{
						id: 'mockTopArtist1',
						name: 'mockTopArtistName1',
						genres: ['mockGenre1', 'mockGenre2'],
						external_urls: { spotify: 'mockTopArtistUrl1' },
					},
					{
						id: 'mockTopArtist2',
						name: 'mockTopArtistName2',
						genres: ['mockGenre1', 'mockGenre3'],
						external_urls: { spotify: 'mockTopArtistUrl2' },
					},
				],
			},
		});

		axios.get.mockResolvedValueOnce({
			data: {
				items: [
					{
						id: 'mockTopTrack1',
						name: 'mockTopTrackName1',
						artists: [{ id: 'mockTopArtist1', name: 'mockTopArtistName1' }],
						external_urls: { spotify: 'mockTopTrackUrl1' },
					},
					{
						id: 'mockTopTrack2',
						name: 'mockTopTrackName2',
						artists: [{ id: 'mockTopArtist2', name: 'mockTopArtistName2' }],
						external_urls: { spotify: 'mockTopTrackUrl2' },
					},
				],
			},
		});

		const res = await api
			.get(`/api/auth/callback?code=${mockCode}`)
			.set('Cookie', `codeVerifier=${mockVerifier}`)
			.expect(200);

		const user = await User.findOne({ spotifyId: 'mockSpotifyId' });

		expect(res.body.token).toBe('mockAccessToken');

		expect(res.body.expiresAt).toBeGreaterThanOrEqual(
			Math.floor(Date.now() / 1000) + 3600 - 1
		);
		expect(res.body.expiresAt).toBeLessThanOrEqual(
			Math.floor(Date.now() / 1000) + 3600 + 1
		);
		expect(res.body.topArtists).toStrictEqual([
			{
				id: 'mockTopArtist1',
				name: 'mockTopArtistName1',
				genres: ['mockGenre1', 'mockGenre2'],
				url: 'mockTopArtistUrl1',
			},
			{
				id: 'mockTopArtist2',
				name: 'mockTopArtistName2',
				genres: ['mockGenre1', 'mockGenre3'],
				url: 'mockTopArtistUrl2',
			},
		]);
		expect(res.body.topGenres).toStrictEqual([
			'mockGenre1',
			'mockGenre2',
			'mockGenre3',
		]);
		expect(res.body.topTracks).toStrictEqual([
			{
				id: 'mockTopTrack1',
				name: 'mockTopTrackName1',
				artists: ['mockTopArtistName1'],
				url: 'mockTopTrackUrl1',
			},
			{
				id: 'mockTopTrack2',
				name: 'mockTopTrackName2',
				artists: ['mockTopArtistName2'],
				url: 'mockTopTrackUrl2',
			},
		]);
		expect(res.body.user).toStrictEqual({
			spotifyId: 'mockSpotifyId',
			displayName: 'Mock User',
			profileImage: 'mockProfileImageL',
		});
		expect(user).toBeDefined();
	});

	describe('POST /auth/refresh', () => {
		beforeEach(async () => {
			const testUser = new User({
				spotifyId: 'mockSpotifyId',
				accessToken: 'mockAccessToken',
				refreshToken: 'mockRefreshToken',
				expiresAt: Math.floor(Date.now() / 1000) + 3600,
			});
			await testUser.save();
		});

		it('should return a new refresh token', async () => {
			axios.post.mockResolvedValueOnce({
				data: {
					access_token: 'newAccessToken',
					refresh_token: 'newRefreshToken',
					expires_in: 3600,
				},
			});
			const res = await api
				.post('/api/auth/refresh')
				.send({ spotifyId: 'mockSpotifyId' })
				.expect(200);

			expect(res.body).toEqual({
				token: 'newAccessToken',
				expiresAt: expect.any(Number),
			});

			const updatedUser = await User.findOne({ spotifyId: 'mockSpotifyId' });
			expect(updatedUser.accessToken).toBe('newAccessToken');
			expect(updatedUser.refreshToken).toBe('newRefreshToken');
		});

		it('should return 404 if user is not found', async () => {
			const res = await api
				.post('/api/auth/refresh')
				.send({ spotifyId: 'unknownUser' })
				.expect(404);

			expect(res.body).toEqual({ error: 'User not found' });
		});

		it('should return 401 if refresh token is not found', async () => {
			const user = new User({
				spotifyId: 'noRefreshUser',
				accessToken: 'mockAccessToken',
				expiresAt: Math.floor(Date.now() / 1000) + 3600,
			});
			await user.save();

			const res = await api
				.post('/api/auth/refresh')
				.send({ spotifyId: 'noRefreshUser' })
				.expect(401);

			expect(res.body).toEqual({ error: 'Refresh token not found' });
		});

		it('should return 500 on Spotify API error', async () => {
			axios.post.mockRejectedValueOnce({
				response: { data: 'Spotify API error' },
			});

			const res = await api
				.post('/api/auth/refresh')
				.send({ spotifyId: 'mockSpotifyId' })
				.expect(500);

			expect(res.body).toEqual({ error: 'Failed to refresh access token' });
		});
	});
});
