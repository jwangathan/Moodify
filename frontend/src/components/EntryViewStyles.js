import styled from 'styled-components';

export const BackButton = styled.button`
	background-color: #5c85ff;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 1rem;
	border-radius: 5px;
	cursor: pointer;
	margin-bottom: 20px;

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
	margin: 10px 0;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #ff1a1a;
	}
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
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
	margin: 10px 10px 10px 0;
	transition: background-color 0.2s ease;

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

	&:hover {
		background-color: #f0f0f0;
	}
`;

export const AlbumImage = styled.img`
	width: 50px;
	height: 50px;
	object-fit: cover;
	border-radius: 8px;
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
	background-color: ${({ selected }) => (selected ? '#4caf50' : '#5c85ff')};
	color: white;
	border: none;
	padding: 10px;
	border-radius: 5px;
	cursor: pointer;
	margin-top: 10px;
	&:hover {
		background-color: ${({ selected }) => (selected ? '#45a049' : '#4a6fd1')};
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
`;
