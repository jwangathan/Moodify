import axios from 'axios';
const baseUrl = '/api/chat';

let token = null;

const setToken = (newToken) => {
	token = `Bearer ${newToken}`;
	console.log(`setToken: ${token}`);
};

const getAll = () => {
	const req = axios.get(baseUrl);
	return req.then((res) => res.data);
};

const create = async (newChat) => {
	const config = {
		headers: { Authorization: token },
	};
	const res = await axios.post(baseUrl, newChat, config);
	return res.data;
};

export default { setToken, getAll, create };
