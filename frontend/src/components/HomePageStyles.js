import styled from 'styled-components';

export const TextContainer = styled.div`
	flex-direction: column;
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	height: 80vh;
`;

export const Title = styled.div`
	font: 600 64px/44% Montserrat, sans-serif;
	@media (max-width: 991px) {
		font-size: 40px;
	}
`;

export const Description = styled.div`
	align-self: stretch;
	margin-top: 58px;
	font: 400 32px/28px Montserrat, sans-serif;
	@media (max-width: 991px) {
		margin-top: 40px;
	}
`;

export const LoginButton = styled.button`
	border-radius: 100px;
	background-color: #1db954;
	margin-top: 51px;
	letter-spacing: 0.1px;
	padding: 20px 33px;
	font: 500 14px/143% Roboto, sans-serif;
	@media (max-width: 991px) {
		margin-top: 40px;
		padding: 0 20px;
	}
`;
