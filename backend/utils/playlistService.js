const axios = require('axios');
const baseUrl = 'https://api.spotify.com/v1';

const toJSON = (res) => {
	const trimmed = res.replace(/```/g, '').replace('json', '');
	const jsonData = JSON.parse(trimmed);
	return jsonData;
};

const getRecommendations = async (
	seed_artists,
	seed_genres,
	seed_tracks,
	attributes,
	token
) => {
	const {
		acousticness,
		danceability,
		energy,
		instrumentalness,
		liveness,
		loudness,
		popularity,
		speechiness,
		tempo,
		valence,
	} = attributes;
	const params = {
		limit: 20,
		seed_artists, //missing 2
		seed_genres, //missing 2,
		seed_tracks, //missing 1,
		target_acousticness: acousticness,
		target_danceability: danceability,
		target_energy: energy,
		target_instrumentalness: instrumentalness,
		target_liveness: liveness,
		target_loudness: loudness,
		target_popularity: popularity,
		target_speechiness: speechiness,
		target_tempo: tempo,
		target_valence: valence,
	};

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: params,
	};

	try {
		const response = await axios.get(`${baseUrl}/recommendations`, config);

		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const createPlaylist = async (spotifyId, mood, token) => {
	try {
		const body = {
			name: `${spotifyId}'s Moodify Playlist`,
			public: false,
			description: `A playlist to help you feel more ${mood}`,
		};

		const params = {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post(
			`${baseUrl}/users/${spotifyId}/playlists`,
			body,
			params
		);

		return res.data;
	} catch (error) {
		console.error(
			'Error creating playlist: ',
			error.response?.data || error.message
		);
		throw new Error('Failed to create playlist');
	}
};

const addTracksToPlaylist = async (playlistId, trackIds, token) => {
	try {
		console.log('add: ', trackIds);
		const trackUris = trackIds.map((trackId) => `spotify:track:${trackId}`);
		const params = {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.post(
			`${baseUrl}/playlists/${playlistId}/tracks`,
			{ uris: trackUris },
			params
		);
		return res.data;
	} catch (error) {
		console.error('Error adding tracks to playlist:', error.response.data);
		throw new Error('Failed to add tracks to playlist');
	}
};

const removeTracksFromPlaylist = async (
	playlistId,
	trackIds,
	snapshot,
	token
) => {
	try {
		console.log('remove:', trackIds);

		const trackUris = trackIds.map((trackId) => ({
			uri: `spotify:track:${trackId}`,
		}));

		const params = {
			data: { tracks: trackUris, snapshot_id: snapshot },
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};
		console.log(params);

		const res = await axios.delete(
			`${baseUrl}/playlists/${playlistId}/tracks`,
			params
		);

		return res.data;
	} catch (error) {
		console.error('Error removing tracks from playlist:', error.response.data);
		throw new Error('Failed to remove tracks from playlist');
	}
};

module.exports = {
	toJSON,
	getRecommendations,
	createPlaylist,
	addTracksToPlaylist,
	removeTracksFromPlaylist,
};
