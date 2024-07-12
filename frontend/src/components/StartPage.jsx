import { useEffect, useState } from 'react';
import QuestionPage from './QuestionPage';

const StartPage = () => {
	const CLIENT_ID = '4223781eb0d54b1d8b92b9dc88bc7908';
	const REDIRECT_URI = 'http://localhost:5173';
	const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
	const RESPONSE_TYPE = 'token';

	const [token, setToken] = useState('');

	useEffect(() => {
		const hash = window.location.hash;
		let token = window.localStorage.getItem('token');

		if (!token && hash) {
			token = hash
				.substring(1)
				.split('&')
				.find((elem) => elem.startsWith('access_token'))
				.split('=')[1];

			window.location.hash = '';
			window.localStorage.setItem('token', token);
		}
		setToken(token);
	}, []);

	return (
		<div>
			{!token ? (
				<a
					href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
				>
					Login to Spotify
				</a>
			) : (
				<QuestionPage token={token} />
			)}
		</div>
	);
};

export default StartPage;
