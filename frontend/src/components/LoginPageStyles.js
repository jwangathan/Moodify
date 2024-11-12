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

export const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: center;
	height: 100vh;
	padding: 20px;
	@media (max-width: 768px) {
		padding: 10px;
	}
`;

export const Title = styled.div`
	font-size: 3rem;
	font-weight: 700;
	color: #2d3436;
	margin-bottom: 10px;
	@media (max-width: 768px) {
		font-size: 2.5rem;
	}
	opacity: 0;

	animation: ${fadeIn} 1s ease-in 0.5s forwards;
`;

export const Description = styled.div`
	font-size: 1.5rem;
	color: #636e72;
	margin-bottom: 30px;
	@media (max-width: 768px) {
		font-size: 1.2rem;
	}
	opacity: 0;

	animation: ${fadeIn} 1s ease-in 1s forwards;
`;

export const LoginButton = styled.button`
	border-radius: 50px;
	background-color: #1db954;
	border: none;
	font-size: 1.2rem;
	font-weight: 600;
	color: #fff;
	padding: 12px 30px;
	cursor: pointer;
	transition: background-color 0.3s ease, transform 0.2s ease;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 1.5s forwards;

	&:hover {
		background-color: #17a74a;
		transform: translateY(-2px);
	}

	&:active {
		transform: translateY(1px);
	}
`;

export const About = styled.div`
	margin: 10px 0 20px 0;
	max-width: 600px;
	font-size: 1rem;
	color: #2d3436;
	line-height: 1.6;
	text-align: center;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 1.5s forwards;

	p {
		margin-bottom: 15px;
	}

	strong {
		color: #1db954;
		font-weight: 700;
	}
`;

export const SectionHeading = styled.h2`
	font-size: 1.8rem;
	color: #2d3436;
	margin: 20px 0 10px;
	font-weight: 600;
	text-align: center;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 1.5s forwards;
`;
