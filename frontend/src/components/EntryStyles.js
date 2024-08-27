import styled from 'styled-components';

export const BackButton = styled.div`
	position: absolute;
	top: 70px;
	left: 10px;
	padding: 10px 20px;
	background-color: #0073e6;
	color: white;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover {
		background-color: #005bb5;
	}

	&:active {
		background-color: #004a99;
	}
`;

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

export const GridContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
`;

export const TrackContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	padding: 20px;
	box-sizing: border-box;
`;

export const AlbumImage = styled.img`
	width: 100%;
	max-width: 200px;
	height: auto;
	margin-bottom: 10px;
	object-fit: contain;
	border-radius: 8px;
`;

export const TrackDetails = styled.div`
	display: flex;
	flex-direction: column;
`;

export const TrackName = styled.h3`
	margin: 0;
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 8px;
`;

export const ArtistName = styled.h3`
	margin: 0;
	font-size: 16px;
	font-weight: normal;
`;

export const AlbumName = styled.p`
	margin: 0;
	font-size: 16px;
	font-weight: lighter;
	margin-top: 4px;
`;
