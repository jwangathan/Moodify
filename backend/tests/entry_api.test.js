const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Entry = require('../models/entry');
const User = require('../models/user');
const api = supertest(app);
const axios = require('axios');

jest.mock('axios');

describe('Entry API', () => {
	let user, entries;

	beforeEach(async () => {
		axios.get.mockReset();
		axios.post.mockReset();
		user = new User({ spotifyId: 'mockSpotifyId', displayName: 'Mock User' });

		await user.save();
		entries = [
			new Entry({
				user: user._id,
				situation: 'I feel happy',
				emotion: 'happy',
				tracks: [{ id: 'track1', name: 'trackName1' }],
			}),
			new Entry({
				user: user._id,
				situation: 'I feel sad',
				emotion: 'sad',
				tracks: [
					{ id: 'track2', name: 'trackName2' },
					{ id: 'track3', name: 'trackName3' },
				],
				playlist: {
					id: 'mockPlaylistId',
					snapshot: 'newSnapshotId',
					selectedTracks: ['track2'],
				},
			}),
		];

		await Entry.insertMany(entries);

		axios.get.mockResolvedValueOnce({
			data: { id: user.spotifyId },
		});
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

			expect(res.body.updated).toBe(false);
			expect(res.body.id).toBe(entryToGet._id.toString());
			expect(res.body.entry.tracks[0].name).toBe('trackName1');
		});

		it('should return a specific entry for the logged in user with updated playlist', async () => {
			const entryToGet = entries[1];

			axios.get.mockResolvedValueOnce({
				data: {
					id: 'mockPlaylistId',
					snapshot_id: 'mockSnapshotId',
					tracks: {
						items: [
							{ track: { id: 'track2', name: 'trackName2' } },
							{ track: { id: 'track3', name: 'trackName3' } },
						],
					},
				},
			});
			axios.get.mockResolvedValueOnce({
				data: { items: [{ id: 'mockPlaylistId' }], next: null },
			});

			const res = await api
				.get(`/api/entry/${entryToGet._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(200);

			expect(res.body.updated).toBe(true);
			expect(res.body.id).toBe(entryToGet._id.toString());
			expect(res.body.entry.tracks[0].name).toBe('trackName2');
			expect(res.body.entry.tracks[1].name).toBe('trackName3');
			expect(res.body.entry.playlist.id).toBe('mockPlaylistId');
			expect(res.body.entry.playlist.snapshot).toBe('mockSnapshotId');
			expect(res.body.entry.playlist.selectedTracks[0]).toBe('track2');
		});

		it('should return a specific entry for the logged in user with the deleted playlist', async () => {
			const entryToGet = entries[1];
			//spotify has a bug that returns a playlist's information, even if it is deleted
			axios.get.mockResolvedValueOnce({
				data: {
					id: 'mockPlaylistId',
					snapshot_id: 'mockSnapshotId',
					tracks: {
						items: [
							{ track: { id: 'track2', name: 'trackName2' } },
							{ track: { id: 'track3', name: 'trackName3' } },
						],
					},
				},
			});
			axios.get.mockResolvedValueOnce({
				data: { items: [{ id: 'notMockPlaylistId' }], next: null },
			});

			const res = await api
				.get(`/api/entry/${entryToGet._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(200);

			expect(res.body.updated).toBe(true);
			expect(res.body.id).toBe(entryToGet._id.toString());
			expect(res.body.entry.tracks[0].name).toBe('trackName2');
			expect(res.body.entry.tracks[1].name).toBe('trackName3');
			expect(res.body.entry.playlist.id).toBe(null);
			expect(res.body.entry.playlist.snapshot).toBe(null);
			expect(res.body.entry.playlist.selectedTracks).toStrictEqual([]);
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
		beforeEach(() => {
			axios.get.mockResolvedValue({
				data: {
					tracks: [
						{
							id: 'trackId1',
							name: 'trackName1',
							artists: [
								{ id: 'artistId1', name: 'artistName1' },
								{ id: 'artistId2', name: 'artistName2' },
							],
							album: {
								id: 'albumId1',
								name: 'albumName1',
								images: [{ url: 'imageUrl1' }],
							},
							preview_url: 'prevUrl1',
							external_urls: {
								spotify: 'extUrl1',
							},
						},
					],
				},
			});
		});
		it('should create a new entry for the user', async () => {
			const newEntry = {
				situation: 'I feel tired',
				emotion: 'energized',
				seed_artists: ['artist1'],
				seed_tracks: ['track1'],
				seed_genres: ['genre1'],
			};

			const res = await api
				.post('/api/entry')
				.set('Authorization', 'Bearer mocked-token')
				.send(newEntry)
				.expect(201);

			expect(res.body.situation).toBe('I feel tired');
			expect(res.body.tracks).toHaveLength(1);
		});
	});

	describe('PUT /entry/:id', () => {
		it('should create a playlist and update the entry', async () => {
			const entryToUpdate = entries[0];

			axios.post.mockResolvedValueOnce({
				data: {
					collaborative: false,
					description: `A playlist to help you feel more ${entryToUpdate.emotion}`,
					id: 'mockPlaylistId',
				},
			});
			axios.put.mockResolvedValueOnce({
				data: {
					snapshot_id: 'newSnapshotId',
				},
			});

			const res = await api
				.put(`/api/entry/${entryToUpdate._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.send({ selectedTracks: ['track1', 'track2'] })
				.expect(201);
			console.log(res.body);
			expect(res.body.message).toBe(
				'Playlist created and songs added to Spotify'
			);
			expect(res.body.entry.playlist.id).toBe('mockPlaylistId');
			expect(res.body.entry.playlist.selectedTracks).toEqual([
				'track1',
				'track2',
			]);
			expect(res.body.entry.playlist.snapshot).toBe('newSnapshotId');
		});

		it('should update the existing playlist and update the entry', async () => {
			const entryToUpdate = entries[1];

			axios.get.mockResolvedValueOnce({
				data: {
					id: 'mockPlaylistId',
					snapshot_id: 'newSnapshotId',
					tracks: {
						items: [{ track: { id: 'track2' } }],
					},
				},
			});
			axios.get.mockResolvedValueOnce({
				data: { items: [{ id: 'mockPlaylistId' }], next: null },
			});

			axios.put.mockResolvedValueOnce({
				data: { snapshot_id: 'newSnapshotId' },
			});

			const res = await api
				.put(`/api/entry/${entryToUpdate._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.send({ selectedTracks: ['track2', 'track3'] })
				.expect(201);

			expect(res.body.message).toBe(
				'Playlist updated in Spotify and saved to database'
			);
			expect(res.body.entry.playlist.id).toBe('mockPlaylistId');
			expect(res.body.entry.playlist.selectedTracks).toEqual([
				'track2',
				'track3',
			]);
			expect(res.body.entry.playlist.snapshot).toBe('newSnapshotId');
		});

		it('should return 400 if selected tracks are not an array', async () => {
			const entryToUpdate = entries[0];

			await api
				.put(`/api/entry/${entryToUpdate._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.send({ selectedTracks: 'track1' })
				.expect(400);
		});
	});

	describe('DELETE /entry/:id', () => {
		it('should delete the entry for the logged in user', async () => {
			const entryToDelete = entries[0];
			await api
				.delete(`/api/entry/${entryToDelete._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(204);

			const remainingEntries = await Entry.find({});
			expect(remainingEntries).toHaveLength(1);
			expect(remainingEntries[0]._id.toString()).toBe(
				entries[1]._id.toString()
			);
		});

		it('should return 401 if user is not authorized to delete the entry', async () => {
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
				.delete(`/api/entry/${otherEntry._id}`)
				.set('Authorization', 'Bearer mocked-token')
				.expect(401);
		});
	});
});
