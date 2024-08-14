import { CenteredComponent, Div3, Div4 } from './DivStyles';
import { LoginButton } from './ButtonStyles';
import loginService from '../services/auth';

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
		<CenteredComponent>
			<Div3>Moodify</Div3>
			<Div4>Using music to meet your mood goals</Div4>
			<LoginButton onClick={handleLogin}>Login To Spotify</LoginButton>
		</CenteredComponent>
	);
};

export default HomePage;
