import styled from 'styled-components';

export const Div = styled.div`
	background-image: radial-gradient(
		circle,
		rgba(238, 174, 202, 1) 0%,
		rgba(148, 187, 233, 1) 100%
	);
	flex-direction: column;
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	padding: 20px;
	min-height: 100vh;
`;

export const Div2 = styled.div`
	display: flex;
	margin-top: 176px;
	width: 330px;
	max-width: 100%;
	flex-direction: column;
	align-items: center;
	@media (max-width: 991px) {
		margin-top: 40px;
	}
`;

export const Div3 = styled.div`
	font: 600 64px/44% Montserrat, sans-serif;
	@media (max-width: 991px) {
		font-size: 40px;
	}
`;

export const Div4 = styled.div`
	align-self: stretch;
	margin-top: 58px;
	font: 400 32px/28px Montserrat, sans-serif;
	@media (max-width: 991px) {
		margin-top: 40px;
	}
`;
