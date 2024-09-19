import axios from 'axios';
const baseUrl = '/api/auth';

const login = async () => {
	const res = await axios.get(`${baseUrl}/login`);
	return res.data;
};

const getUser = async (code) => {
	const res = await axios.get(`${baseUrl}/callback`, { params: code });
	return res.data;
};

const refresh = async () => {
	const res = await axios.post(`${baseUrl}/refresh`);
	return res.data;
};

export default { getUser, login, refresh };
