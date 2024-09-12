import styled from 'styled-components';

export const ModalBackground = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const ModalContainer = styled.div`
	background: white;
	padding: 20px;
	border-radius: 8px;
	text-align: center;
`;

export const Countdown = styled.div`
	margin: 20px, 0;
	font-size: 20px;
`;
