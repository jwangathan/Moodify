import styled from 'styled-components';

export const EntryItem = styled.div`
	display: flex;
	padding: 20px;
	flex-direction: column;
	gap: 1rem;
	background-color: #fff;
	border-radius: 8px;
	transition: background-color 0.3s ease;

	p {
		margin: 0;
		font-weight: bold;
	}

	em {
		color: #555;
		font-style: normal;
		font-weight: 400;
	}

	&:hover {
		background-color: #f0f4ff;
	}
`;

export const ListItem = styled.div`
	background-color: #f9f9f9;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	cursor: pointer;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: scale(0.98);
	}
`;

export const UnorderedList = styled.ul`
	list-style-type: none;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 800px;
	margin: 0 auto;
`;

export const CenteredText = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	font-size: 2rem;
	font-weight: bold;
`;
