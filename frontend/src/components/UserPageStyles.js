import styled from 'styled-components';

export const ListContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	padding: 20px;
	margin: 20px;
	background: #f7f7f7;
	border-radius: 10px;
	box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ListWrapper = styled.div`
	background: white;
	width: 300px;
	margin: 20px;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease-in-out;

	&:hover {
		transform: translateY(-10px);
	}
`;

export const ListHeader = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 15px;
`;

export const OrderedList = styled.ol`
	list-style-type: none;
	padding-left: 0;
	margin: 0;

	li {
		padding: 10px;
		font-size: 1rem;
		border-bottom: 1px solid #e0e0e0;
		color: #555;

		&:hover {
			color: #333;
			font-weight: 600;
		}
	}
`;

export const Centered = styled.div`
	flex-direction: column;
	display: flex;
	align-items: center;
	text-align: center;
	padding: 20px;

	img {
		border-radius: 50%;
		width: 150px;
		height: 150px;
		object-fit: cover;
		margin-bottom: 20px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 10px;
		color: #333;
	}
`;
