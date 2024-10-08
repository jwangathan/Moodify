import styled from 'styled-components';

export const Background = styled.div`
	background-image: radial-gradient(
		circle at center,
		rgba(238, 174, 202, 0.8) 0%,
		rgba(148, 187, 233, 0.5) 50%,
		rgba(108, 166, 245, 0.2) 100%
	);
	background-repeat: no-repeat;
	background-size: cover;
	min-height: 100vh;
	min-width: 100vw;
	overflow: hidden;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const ContentWrapper = styled.div`
	flex-grow: 1;
`;
