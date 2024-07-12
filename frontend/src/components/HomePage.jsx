import { useEffect } from 'react';
import { redirectToSpotifyAuthorize } from '../services/authorization_pkce';
const HomePage = () => {
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		let code = urlParams.get('code');
	});

	return (
		<div>
			<button onClick={redirectToSpotifyAuthorize}> login </button>
		</div>
	);
};

export default HomePage;
