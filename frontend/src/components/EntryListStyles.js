import styled from 'styled-components';

export const EntryItem = styled.div`
	display: inline-block;
	cursor: pointer;
	padding: 20px;
	background-color: #f8f8f8;
	border-radius: 8px;
	transition: background-color 0.3s, color 0.3s;

	p,
	em {
		margin: 5px 0;
		font-size: 16px;
		color: #333;
	}

	&:hover {
		background-color: #e0e0e0;
		color: #0073e6;
	}

	&:active {
		background-color: #ccc;
		color: #004a99;
	}
`;

export const ListItem = styled.div`
	margin-bottom: 20px;
`;

export const UnorderedList = styled.ul`
	list-style-type: none;
`;
