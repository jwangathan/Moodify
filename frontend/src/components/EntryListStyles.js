import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const EntryItem = styled.div`
	display: flex;
	padding: 20px;
	flex-direction: column;
	gap: 1rem;
	background-color: #fff;
	border-radius: 8px;
	transition: background-color 0.3s ease;
	opacity: 0;
	animation: ${fadeIn} 0.5s ease-out forwards;

	p {
		margin: 0;
		font-weight: bold;
	}

	em {
		color: #555;
		font-style: normal;
		font-weight: 400;
	}

	&:hover {
		background-color: #f0f4ff;
	}
`;

export const ListItem = styled.div`
	background-color: #f9f9f9;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	cursor: pointer;
	opacity: 0;
	animation: ${fadeIn} 0.5s ease-out forwards;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: scale(0.98);
	}
`;

export const UnorderedList = styled.ul`
	list-style-type: none;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 800px;
	margin: 0 auto;
	opacity: 0;
	animation: ${fadeIn} 0.5s ease-out forwards;

	& > li {
		animation-delay: 0.2s;
	}
`;

export const CenteredText = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	height: 100vh;
	font-size: 2rem;
	font-weight: bold;
	text-align: center;
	gap: 1rem;
`;

export const Heading = styled.h1`
	font-size: 2.5rem;
	font-weight: 600;
	margin-bottom: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Button = styled.button`
	background-color: #4caf50;
	color: white;
	border: none;
	padding: 12px 24px;
	text-align: center;
	font-size: 1rem;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #45a049;
	}

	&:active {
		transform: scale(0.98);
	}
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin-bottom: 2rem;
`;
