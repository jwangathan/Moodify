import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FooterContainer } from './FooterStyles';

const Footer = () => {
	return (
		<FooterContainer>
			<p>© {new Date().getFullYear()} Jonathan Wang. All rights reserved.</p>
			<p>
				<a
					href="https://github.com/jwangathan"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaGithub /> GitHub
				</a>
				<a
					href="https://linkedin.com/in/jonathanghwang"
					target="blank"
					rel="noopener noreferrer"
				>
					<FaLinkedin /> LinkedIn
				</a>
			</p>
			<p>
				Content powered by
				<a
					href="https://www.spotify.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img
						src="/assets/spotifyLogo.png"
						alt="Spotify Logo"
						style={{ width: '80px', verticalAlign: 'middle' }}
					/>
				</a>
			</p>
		</FooterContainer>
	);
};

export default Footer;
