import loginService from '../services/auth';

import {
	TextContainer,
	Title,
	Description,
	LoginButton,
} from './HomePageStyles';

const HomePage = () => {
	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const res = await loginService.login();
			window.location.href = res;
		} catch (error) {
			console.log('Error during login: ', error);
		}
	};

	return (
		<TextContainer>
			<Title>Moodify</Title>
			<Description>Using music to meet your mood goals</Description>
			<LoginButton onClick={handleLogin}>Login To Spotify</LoginButton>
		</TextContainer>
	);
};

export default HomePage;
