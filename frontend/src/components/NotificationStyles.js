import styled from 'styled-components';

export const Success = styled.div`
	opacity: ${({ variant }) => (variant ? 1 : 0)};
	padding: 15px 20px;
	border-radius: 5px;
	margin: 10px 0;
	font-size: 1rem;
	color: white;
	background-color: '#4caf50';
	border: 1 px solid '#388e3c';
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}
`;

export const Warning = styled.div`
	opacity: ${({ variant }) => (variant ? 1 : 0)};
	padding: 15px 20px;
	border-radius: 5px;
	margin: 10px 0;
	font-size: 1rem;
	color: white;
	background-color: ${({ variant }) => {
		switch (variant) {
			case 'success':
				return '#4caf50';
			case 'error':
				return '#f44336';
			default:
				return '#6c757d';
		}
	}};
	border: 1 px solid
		${({ variant }) => {
			switch (variant) {
				case 'success':
					return '#388e3c';
				case 'error':
					return '#d32f2f';
				default:
					return '#6c757d';
			}
		}};

	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}
`;

export const Error = styled.div`
	opacity: ${({ variant }) => (variant ? 1 : 0)};
	padding: 15px 20px;
	border-radius: 5px;
	margin: 10px 0;
	font-size: 1rem;
	color: white;
	background-color: '#f44336'
	border: 1 px solid '#d32f2f'

	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > button {
		background: none;
		border: none;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;

		&:hover {
			opacity: 0.8;
		}
	}
`;
