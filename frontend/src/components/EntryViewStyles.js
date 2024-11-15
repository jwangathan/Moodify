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

export const BackButton = styled.button`
	background-color: #5c85ff;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: pointer;
	margin: 10px;
	opacity: 0;
	animation: ${fadeIn} 0.8s ease-in 1s forwards;

	&:hover {
		background-color: #4a6fd1;
	}
`;

export const RemoveButton = styled.button`
	background-color: #ff4d4d;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: pointer;
	margin: 10px;
	transition: background-color 0.2s ease;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 1s forwards;

	&:hover {
		background-color: #ff1a1a;
	}
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const SelectAllButton = styled.button`
	background-color: #4caf50;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: pointer;
	margin: 10px 10px 10px 0;
	transition: background-color 0.2s ease;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 1s forwards;

	&:hover {
		background-color: #45a049;
	}
`;

export const DeselectAllButton = styled.button`
	background-color: #ff9800;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: pointer;
	margin: 0px 10px 0px 10px;
	transition: background-color 0.2s ease;
	opacity: 0;
	animation: ${fadeIn} 1s ease-in 1s forwards;

	&:hover {
		background-color: #fb8c00;
	}
`;

export const GridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
	margin-top: 20px;
`;

export const TrackCard = styled.div`
	backgroun: #fff;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	margin: 10px 0;
	padding: 10px;
	transition: background 0.3s;
	cursor: pointer;
	opacity: 0;
	animation: ${fadeIn} 1.5s ease-in 1s forwards;

	&:hover {
		background-color: #f0f0f0;
	}
`;

export const AlbumImage = styled.img`
	width: 50px;
	height: 50px;
	object-fit: cover;
	border-radius: 2px;
	transition: transform 0.2s ease, box-shadow 0.2s ease;

	@media (min-width: 1024px) {
		border-radius: 4px; /* large devices */
	}

	&:hover {
		transform: scale(1.05);
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
`;

export const TrackHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
`;

export const TrackDetails = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 10px;
`;

export const TrackName = styled.h3`
	font-size: 1.2rem;
	margin: 0;
	margin-left: 10px;
`;

export const ArtistName = styled.h3`
	margin: 5px 0;
	color: #555;
`;

export const AlbumName = styled.p`
	margin: 5px 0;
	color: #888;
`;

export const SelectButton = styled.button`
	display: inline-block;
	background-color: ${({ selected }) => (selected ? '#4caf50' : 'transparent')};
	padding: 0px;
	border-radius: 99%;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: ${({ selected }) => (selected ? '#45a049' : '#e0e0e0')};
	}

	svg {
		display: block;
		height: 1.5rem;
		width: 1.5rem;
		color: black;
	}
`;

export const PlaylistButton = styled.button`
	background-color: ${({ disabled }) => (disabled ? '#ddd' : '#5c85ff')};
	color: ${({ disabled }) => (disabled ? '#aaa' : 'white')};
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	margin: 20px auto;
	display: block;
	text-align: center;
	opacity: 0;
	animation: ${fadeIn} 1.75s ease-in forwards;

	&:hover {
		background-color: ${({ disabled }) => (disabled ? '#ddd' : '#4a6fd1')};
	}
`;

export const AudioPlayer = styled.audio`
	width: 100%;
	margin: 10px 0;
`;

export const Title = styled.h1`
	font-size: 2rem;
	color: #333;
	text-align: center;
	margin-bottom: 20px;
	font-weight: bold;
	text-transform: uppercase;
	opacity: 0;
	padding-top: 10px;
	animation: ${fadeIn} 0.5s ease-in 1s forwards;
`;

export const PlaylistAccessButton = styled.button`
	background-color: #1db954;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: pointer;
	position: absolute;
	top: 20px;
	right: 20px;
	opacity: 0;
	animation: ${fadeIn} 0.8s ease-in 1s forwards

	&:hover {
		background-color: #1ed760;
	}
`;

export const DescriptionBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 20px 0;
	opacity: 0;
	animation: ${fadeIn} 0.5s ease-in 1s forwards;
`;

export const SituationText = styled.p`
	font-size: 1rem;
	color: #333;
	margin: 5px 0;
`;

export const EmotionText = styled.p`
	font-size: 1rem;
	color: #333;
	margin: 5px 0;
`;
