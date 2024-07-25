import axios from 'axios';
const baseUrl = 'https://api.spotify.com/v1';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const getTopArtists = async () => {
	const config = {
		headers: { Authorization: token },
		params: { limit: 50 },
	};

	const res = await axios.get(`${baseUrl}/me/top/artists`, config);
	return res.data;
};

const getTopTracks = async () => {
	const config = {
		headers: { Authorization: token },
		params: { limit: 20 },
	};

	const res = await axios.get(`${baseUrl}/me/top/tracks`, config);
	return res.data;
};

export default { setToken, getTopArtists, getTopTracks };
