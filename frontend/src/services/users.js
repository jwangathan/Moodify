import axios from 'axios';
const spotifyUrl = 'https://api.spotify.com/v1';
const baseUrl = '/api/user';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const resetToken = () => {
	token = null;
};

const getUserById = async (spotifyId) => {
	const res = await axios.get(`${baseUrl}/${spotifyId}`);
	return res.data;
};

const getTopArtists = async () => {
	const config = {
		headers: { Authorization: token },
		params: { limit: 50 },
	};

	const res = await axios.get(`${spotifyUrl}/me/top/artists`, config);
	return res.data;
};

const getTopTracks = async () => {
	const config = {
		headers: { Authorization: token },
		params: { limit: 20 },
	};

	const res = await axios.get(`${spotifyUrl}/me/top/tracks`, config);
	return res.data;
};

export default {
	setToken,
	resetToken,
	getUserById,
	getTopArtists,
	getTopTracks,
};
