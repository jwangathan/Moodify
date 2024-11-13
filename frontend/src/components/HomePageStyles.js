import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const ListContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	padding: 20px;
	margin: 20px;
	border-radius: 10px;
`;

export const ListWrapper = styled.div`
	background: white;
	width: 300px;
	margin: 20px;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease-in-out;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 0.5s forwards;
	display: flex;
	flex-direction: column;
	position: relative;

	&:hover {
		transform: translateY(-10px);
	}
`;

export const ListHeader = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 15px;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in forwards;
	position: sticky;
	top: 0;
	z-index: 10;
	background-color: white;
	width: 100%;
	left: 0;
	box-sizing: border-box;
`;

export const OrderedList = styled.ol`
	list-style-type: none;
	padding-left: 0;
	margin: 0;
	flex-grow: 1;
	max-height: 500px;
	overflow-y: auto;
`;

export const ListItem = styled.li.withConfig({
	shouldForwardProp: (prop) => prop !== 'delay',
})`
	padding: 10px;
	font-size: 1rem;
	border-bottom: 1px solid #e0e0e0;
	color: #555;
	opacity: 0;
	animation: ${fadeIn} 0.8s ease-in 1s forwards;
	animation-delay: ${(props) => props.delay};

	&:hover {
		color: #333;
		font-weight: 600;
		cursor: pointer;
	}
`;

export const Centered = styled.div`
	flex-direction: column;
	display: flex;
	align-items: center;
	text-align: center;
	padding: 20px;
	opacity: 0;
	animation: ${fadeIn} 1.5s ease-in 0.5s forwards;

	img {
		border-radius: 50%;
		width: 150px;
		height: 150px;
		object-fit: cover;
		margin-bottom: 20px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		padding-top: 45px;
		background-color: #f0f0f0;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 10px;
		color: #333;
	}
`;
