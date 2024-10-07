import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Navbar = styled.nav`
	background-color: #343a40;
	padding: 0.5rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: white;
`;

export const Brand = styled.div`
	font-size: 1.5rem;
	font-weight: bold;
	color: white;
`;

export const Toggle = styled.div`
	display: flex;
	align-items: center;
`;

export const NavList = styled.ul`
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;
`;

export const NavItem = styled.li`
	margin: 0 0.5rem;
`;

export const StyledLink = styled(Link)`
	text-decoration: none;
	color: white;
	padding: 5px;
	font-size: 1rem;
	transition: color 0.3s ease;

	&:hover {
		color: #ffc107;
	}
`;

export const UserActions = styled.div`
	display: flex;
	align-items: center;
`;

export const UserInfo = styled.div`
	margin-right: 1rem;
	font-size: 1rem;
`;

export const LogoutButton = styled.button`
	background-color: #007bff;
	border: none;
	color: white;
	padding: 0.375rem 0.75rem;
	font-size: 1rem;
	border-radius: 0.25rem;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #0056b3;
	}
`;
