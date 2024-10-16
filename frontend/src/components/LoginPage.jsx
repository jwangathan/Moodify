import loginService from '../services/auth';
import { useSelector } from 'react-redux';
import {
	TextContainer,
	Title,
	Description,
	LoginButton,
} from './LoginPageStyles';
import Spinner from './Spinner';

const LoginPage = () => {
	const user = useSelector((state) => state.auth);
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
			{!user && (
				<LoginButton onClick={handleLogin}>Login To Spotify</LoginButton>
			)}
		</TextContainer>
	);
};

export default LoginPage;
