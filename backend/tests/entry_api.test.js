const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Entry = require('../models/entry');
const User = require('../models/user');
const api = supertest(app);
const axios = require('axios');

jest.mock('../models/entry');
jest.mock('../models/user');
jest.mock('axios');

describe('Entry API', () => {
	let user, entries;

	beforeEach(() => {
		user = { _id: 'mockId', spotifyId: 'mockSpotifyId' };
		entries = [
			{
				_id: 'entry1',
				user: user._id,
				tracks: [{ id: 'track1', name: 'trackName1' }],
			},
			{
				_id: 'entry2',
				user: user._id,
				tracks: [{ id: 'track2', name: 'trackName2' }],
			},
		];

		Entry.find.mockReturnValue({
			populate: jest.fn().mockResolvedValue(entries),
		});
		User.findOne.mockResolvedValue(user);

		axios.get.mockResolvedValue({
			data: { id: user.spotifyId },
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		mongoose.connection.close();
	});

	describe('GET /entry', () => {
		it('should return all entries for the logged in user', async () => {
			const res = await api
				.get('/api/entry')
				.set('Authorization', 'Bearer mocked-token')
				.expect(200);
			expect(res.body).toHaveLength(2);
			expect(res.body[0].user).toBe(user._id.toString());
			expect(res.body[0].tracks[0].name).toBe('trackName1');
		});
	});
});
