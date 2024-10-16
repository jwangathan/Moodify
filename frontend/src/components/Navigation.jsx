import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/authReducer';

import {
	Navbar,
	Brand,
	Toggle,
	NavList,
	NavItem,
	StyledLink,
	UserActions,
	UserInfo,
	LogoutButton,
} from './NavigationStyles';

const Navigation = () => {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = (event) => {
		event.preventDefault();
		console.log('logging out user', user.spotifyId);
		navigate('/');
		dispatch(logout());
	};

	return (
		<Navbar>
			<Brand onClick={() => navigate('/')}>Moodplay</Brand>
			<Toggle>
				<NavList>
					<NavItem>
						<StyledLink to="/home">User Info</StyledLink>
					</NavItem>
					<NavItem>
						<StyledLink to="/survey">Question</StyledLink>
					</NavItem>
					<NavItem>
						<StyledLink to="/entries">My Playlists</StyledLink>
					</NavItem>
				</NavList>
			</Toggle>
			<UserActions>
				<UserInfo>{user.user.displayName} logged in </UserInfo>
				<LogoutButton onClick={handleLogout}>Logout</LogoutButton>
			</UserActions>
		</Navbar>
	);
};

export default Navigation;
