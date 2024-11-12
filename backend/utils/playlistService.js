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
		genre,
	} = attributes;
	seed_genres += genre;
	const params = {
		limit: 20,
		seed_artists, //2 total (top 2 artists)
		seed_genres, //3 total (top 2 genres + genre from attributes)
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
		let config = {
			params: {
				fields: 'id, snapshot_id, tracks.items(track.id)',
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const res = await axios.get(`${baseUrl}/playlists/${playlistId}`, config);

		const targetId = res.data.id;

		if (await checkPlaylist(targetId, token)) {
			//if playlist exists
			return {
				exists: true,
				playlist: res.data,
			};
		}
		return {
			exists: false,
			playlist: { id: null, snapshot_id: null, tracks: [] },
		};
	} catch (err) {
		console.error('Error getting playlist: ', err.response?.data || err);
		throw new Error('FailedToGetPlaylist');
	}
};

const checkPlaylist = async (targetId, token) => {
	let url = `${baseUrl}/me/playlists`;
	let playlistFound = false;

	while (url) {
		try {
			const config = {
				params: { limit: 50 },
				headers: { Authorization: `Bearer ${token}` },
			};

			const currPlaylists = await axios.get(url, config);
			const playlists = currPlaylists.data.items;

			playlistFound = playlists.some((playlist) => playlist.id === targetId);

			if (playlistFound) {
				return true;
			}

			url = currPlaylists.data.next;
		} catch (err) {
			console.error('Error getting playlists: ', err.response?.data || err);
			throw new Error('FailedToGetPlaylists');
		}
	}

	return false;
};

const createPlaylist = async (spotifyId, displayName, mood, token) => {
	try {
		const body = {
			name: `${displayName}'s Moodify Playlist`,
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
		console.log('Created playlist');

		return res.data;
	} catch (error) {
		console.error(
			'Error creating playlist: ',
			error.response?.data || error.message
		);
		throw new Error('Failed to create playlist');
	}
};

const updatePlaylist = async (playlistId, trackIds, token) => {
	try {
		console.log('update: ', trackIds);
		const trackUris = trackIds.map((trackId) => `spotify:track:${trackId}`);
		const body = {
			uris: trackUris,
		};
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put(
			`${baseUrl}/playlists/${playlistId}/tracks`,
			body,
			config
		);
		return res.data;
	} catch (error) {
		console.error('Error updating playlist:', error.response.data);
		throw new Error('Failed to update playlist');
	}
};

module.exports = {
	toJSON,
	getRecommendations,
	arraysNotEqual,
	getPlaylist,
	checkPlaylist,
	createPlaylist,
	updatePlaylist,
};
