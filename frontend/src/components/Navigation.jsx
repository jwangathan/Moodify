import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/authReducer';

const Navigation = () => {
	const currUser = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = (event) => {
		event.preventDefault();
		console.log('logging out user', currUser.spotifyId);
		navigate('/');
		dispatch(logout());
	};

	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Navbar.Brand>Moodplay</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav.Link href="#" as="span">
					<Link style={{ padding: 5 }} to="/">
						User Info
					</Link>
				</Nav.Link>
				<Nav.Link href="#" as="span">
					<Link style={{ padding: 5 }} to="/survey">
						Question
					</Link>
				</Nav.Link>
				<Nav.Link href="#" as="span">
					<Link style={{ padding: 5 }} to="/entries">
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
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigation;
