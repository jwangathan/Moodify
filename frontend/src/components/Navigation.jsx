import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/authReducer';
import loginService from '../services/auth';

const Navigation = () => {
	const currUser = useSelector((state) => state.authentication);
	const dispatch = useDispatch();

	const handleLogout = (event) => {
		event.preventDefault();
		console.log('logging out user', currUser.spotifyId);
		dispatch(logout());
	};

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
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Navbar.Brand>Moodplay</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav.Link href="#" as="span">
					<Link style={{ padding: 5 }} to="/">
						Home
					</Link>
				</Nav.Link>
				{currUser ? (
					<>
						<Nav.Link href="#" as="span">
							<Link style={{ padding: 5 }} to="/survey">
								Question
							</Link>
						</Nav.Link>
						<Nav.Link href="#" as="span">
							<Link style={{ padding: 5 }} to="/playlist">
								My Playlists
							</Link>
						</Nav.Link>
						<Nav className="ms-auto">
							<Navbar.Text style={{ padding: 5 }}>
								{currUser.user.displayName} logged in{' '}
							</Navbar.Text>
							<Button variant="primary" onClick={handleLogout}>
								Logout
							</Button>
						</Nav>
					</>
				) : (
					<Nav className="ms-auto">
						<Button variant="primary" onClick={handleLogin}>
							Login with Spotify
						</Button>
					</Nav>
				)}
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigation;
