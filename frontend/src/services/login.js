import axios from 'axios';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

const getToken = async (code) => {
	let codeVerifier = localStorage.getItem('code_verifier');
	const response = await axios.post();
};
