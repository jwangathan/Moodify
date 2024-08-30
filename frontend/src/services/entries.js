import axios from 'axios';
const baseUrl = '/api/entry';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
};

const getAll = () => {
	const config = {
		headers: { Authorization: token },
	};
	const req = axios.get(baseUrl, config);
	return req.then((res) => res.data);
};

const create = async (newEntry) => {
	const config = {
		headers: { Authorization: token },
	};
	const res = await axios.post(baseUrl, newEntry, config);
	return res.data;
};

export default { setToken, getAll, create };
