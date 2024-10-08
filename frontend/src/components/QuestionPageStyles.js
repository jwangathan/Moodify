import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

const fadeOut = keyframes`
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
`;

export const QuestionContainer = styled.div`
	flex-direction: column;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	padding: 20px;

	&.fade-enter {
		animation: ${fadeIn} 0.5s forwards;
	}

	&.fade-exit {
		animation: ${fadeOut} 0.5s forwards;
	}

	h1 {
		font-size: 2.5rem;
		color: #333;
		margin-bottom: 1rem;
		text-align: center;
	}

	h3 {
		font-size: 1.2rem;
		color: #666;
		text-align: center;
		margin-bottom: 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 500px;

		input[type='text'] {
			width: 100%;
			padding: 15px;
			font-size: 1.1rem;
			border: 2px solid #ddd;
			border-radius: 8px;
			margin-bottom: 20px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			outline: none;
			transition: border-color 0.3s ease;

			&:focus {
				border-color: #5c85ff;
			}
		}

		input[type='submit'] {
			background-color: #5c85ff;
			color: white;
			border: none;
			border-radius: 8px;
			padding: 15px 30px;
			font-size: 1.1rem;
			cursor: pointer;
			transition: background-color 0.3s ease, box-shadow 0.3s ease;

			&:hover {
				background-color: #476bcc;
				box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}
`;
