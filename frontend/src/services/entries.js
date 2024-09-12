import axios from 'axios';
const baseUrl = '/api/entry';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const getAll = async () => {
	const config = {
		headers: { Authorization: token },
	};
	const res = await axios.get(baseUrl, config);
	return res.data;
};

const getEntry = async (id) => {
	const res = await axios.get(`${baseUrl}/${id}`);
	return res.data;
};

const createEntry = async (newEntry) => {
	const config = {
		headers: { Authorization: token },
	};
	const res = await axios.post(baseUrl, newEntry, config);
	return res.data;
};

const managePlaylist = async (id, selectedTracks) => {
	const config = {
		headers: { Authorization: token },
	};
	const res = await axios.put(`${baseUrl}/${id}`, { selectedTracks }, config);
	return res.data;
};

export default { setToken, getAll, getEntry, createEntry, managePlaylist };
