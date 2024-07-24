import axios from 'axios';

const login = async () => {
	const res = await axios.get('/api/auth/login');
	return res.data;
};

const getUser = async (code) => {
	const res = await axios.get('/api/auth/callback', { params: code });
	return res.data;
};

export default { getUser, login };
