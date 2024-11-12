import loginService from '../services/auth';
import { useSelector } from 'react-redux';
import {
	TextContainer,
	Title,
	Description,
	LoginButton,
	About,
	SectionHeading,
} from './LoginPageStyles';

const LoginPage = () => {
	const { user } = useSelector((state) => state.auth);
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
			<About>
				<SectionHeading>About</SectionHeading>
				<p>
					Welcome to <strong>Moodify</strong>! This is a personal project
					designed as a journaling app where users can log their daily highs and
					lows, along with their desired emotional outcomes from these
					experiences. By analyzing this input, Moodify recommends music that
					aligns with users' mood goals.
				</p>
				{user && (
					<>
						<SectionHeading>How it Works</SectionHeading>
						<p>
							Users can record emotions in an entry, where they are prompted to
							describe a situation and a desired mood. Generating an entry will
							include recommended songs, allowing users to select and compile
							them into playlists. You can create and manage these entries
							within the <strong>My Playlists</strong> tab.
						</p>
					</>
				)}
			</About>
			{!user && (
				<LoginButton onClick={handleLogin}>Login To Spotify</LoginButton>
			)}
		</TextContainer>
	);
};

export default LoginPage;
