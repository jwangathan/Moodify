import styled from 'styled-components';

export const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	justify-content: center;
	height: 100vh;
	padding: 20px;
`;

export const Title = styled.div`
	font-size: 3rem;
	font-weight: 700;
	color: #2d3436;
	margin-bottom: 10px;
	@media (max-width: 768px) {
		font-size: 2.5rem;
	}
`;

export const Description = styled.div`
	font-size: 1.5rem;
	color: #636e72;
	margin-bottom: 30px;
	@media (max-width: 768px) {
		font-size: 1.2rem;
	}
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

	&:hover {
		background-color: #17a74a;
		transform: translateY(-2px);
	}

	&:active {
		transform: translateY(1px);
	}
`;
