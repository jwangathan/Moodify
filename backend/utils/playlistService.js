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

const arraysNotEqual = (arr1, arr2) => {
	if (arr1.length !== arr2.length) {
		return true;
	}

	const sortedArr1 = arr1.slice().sort();
	const sortedArr2 = arr2.slice().sort();

	for (let i = 0; i < sortedArr1.length; i++) {
		if (sortedArr1[i] !== sortedArr2[i]) {
			return true;
		}
	}
	return false;
};

const getPlaylist = async (playlistId, token) => {
	try {
		const config = {
			params: {
				fields: 'id, snapshot_id, tracks.items(track.id)',
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const res = await axios.get(`${baseUrl}/playlists/${playlistId}`, config);
		return res.data;
	} catch (error) {
		console.error('Error getting playlist: ', error.response?.data || error);
		throw new Error('Failed to get playlist');
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
	arraysNotEqual,
	getPlaylist,
	createPlaylist,
	addTracksToPlaylist,
	removeTracksFromPlaylist,
};
