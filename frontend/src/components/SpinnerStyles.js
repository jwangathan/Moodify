import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
  transform: rotate(0deg);
  }

  100% {
  transform: rotate(360deg);}
`;

export const SpinnerContainer = styled.div`
	border: 8px solid rgba(0, 0, 0, 0.1);
	border-top: 8px solid #3498db;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	animation: ${spin} 1s linear infinite;
`;

export const CenteredContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;
