import styled from 'styled-components';

const NotificationBase = styled.div`
	display: flex;
	align-items: center;
	padding: 12px;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 500;
	margin: 10px 0;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
	color: #fff;
	transition: all 0.3s ease;

	svg {
		margin-right: 8px;
		font-size: 24px;
	}
`;

export const Success = styled(NotificationBase)`
	background-color: #28a745;
`;

export const Warning = styled.div`
	background-color: #ffc107;
	color: #212529;
`;

export const Error = styled.div`
	background-color: #dc3545;
`;
