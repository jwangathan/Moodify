const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Entry = require('../models/entry');
const User = require('../models/user');
const api = supertest(app);
const axios = require('axios');

// jest.mock('../models/entry');
// jest.mock('../models/user');
jest.mock('axios');

describe('Entry API', () => {
	let user, entries;

	beforeEach(async () => {
		user = new User({ spotifyId: 'mockSpotifyId', displayName: 'Mock User' });

		await user.save();
		entries = [
			new Entry({
				user: user._id,
				tracks: [{ id: 'track1', name: 'trackName1' }],
			}),
			new Entry({
				user: user._id,
				tracks: [{ id: 'track2', name: 'trackName2' }],
			}),
		];

		await Entry.insertMany(entries);
	});

	afterEach(async () => {
		await Entry.deleteMany({});
		await User.deleteMany({});
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	describe('GET /entry', () => {
		it('should return all entries for the logged in user', async () => {
			axios.get.mockResolvedValue({
				data: { id: user.spotifyId },
			});
			const res = await api
				.get('/api/entry')
				.set('Authorization', 'Bearer mocked-token')
				.expect(200);

			expect(res.body).toHaveLength(2);
			expect(res.body[0].user.id).toBe(user._id.toString());
			expect(res.body[0].tracks[0].name).toBe('trackName1');
			expect(res.body[1].user.id).toBe(user._id.toString());
			expect(res.body[1].tracks[0].name).toBe('trackName2');
		});
	});

	describe('GET /entry/:id', () => {
		it('should return a specific entry for the logged in user', async () => {
			const entryToGet = entries[0];

			const res = await api
				.get(`/api/entry/${entryToGet._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(200);

			expect(res.body.id).toBe(entryToGet._id.toString());
			expect(res.body.entry.tracks[0].name).toBe('trackName1');
		});

		it('should return 404 if entry does not exist', async () => {
			const nonExistentId = new mongoose.Types.ObjectId();

			await api
				.get(`/api/entry/${nonExistentId}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(404);
		});

		it('should return 401 if user is not authorized to view the entry', async () => {
			const otherUser = new User({
				spotifyId: 'otherSpotifyId',
				displayName: 'Other User',
			});
			await otherUser.save();
			const otherEntry = new Entry({
				user: otherUser._id,
				tracks: [{ id: 'track3', name: 'trackName3' }],
			});
			await otherEntry.save();

			await api
				.get(`/api/entry/${otherEntry._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(401);
		});
	});

	describe('POST /entry', () => {
		it('should create a new entry for the user', async () => {
			const newEntry = {
				situation: 'I feel tired',
				emotion: 'energized',
				seed_artists: ['artist1'],
				seed_tracks: ['track1'],
				seed_genres: ['genre1'],
			};
			axios.post.mockResolvedValue({
				data: {
					tracks: [
						{
							id: 'trackId',
							name: 'trackName',
							album: {
								id: 'albumId',
								name: 'albumName',
								images: [{ url: 'imageURL' }],
							},
							artists: [{ id: 'artistId', name: 'artistName' }],
						},
					],
				},
			});

			const res = await api
				.post('/api/entry')
				.set('Authorization', 'Bearer mocked-token')
				.send(newEntry)
				.expect(201);

			expect(res.body.situation).toBe('I feel tired');
			expect(res.body.tracks).toHaveLength(1);
		});
	});
});
