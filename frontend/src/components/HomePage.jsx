import { Div2, Div3, Div4 } from './DivStyles';
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
		<Div2>
			<Div3>Moodify</Div3>
			<Div4>Using music to meet your mood goals</Div4>
			<LoginButton onClick={handleLogin}>Login To Spotify</LoginButton>
		</Div2>
	);
};

export default HomePage;
