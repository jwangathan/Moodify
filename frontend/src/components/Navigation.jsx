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
		<Navbar>
			<Brand>Moodplay</Brand>
			<Toggle>
				<NavList>
					<NavItem>
						<StyledLink to="/">User Info</StyledLink>
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
				<UserInfo>{currUser.user.displayName} logged in </UserInfo>
				<LogoutButton onClick={handleLogout}>Logout</LogoutButton>
			</UserActions>
		</Navbar>
	);
};

export default Navigation;
