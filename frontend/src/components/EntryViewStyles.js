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

export const SelectButton = styled.button`
	background-color: #007bff; /* Blue background */
	color: white; /* White text */
	border: none; /* Remove border */
	border-radius: 5px; /* Rounded corners */
	padding: 10px 15px; /* Padding inside the button */
	cursor: pointer; /* Pointer cursor on hover */
	font-size: 14px; /* Font size */
	margin-top: 10px; /* Margin at the top */
	transition: background-color 0.3s ease; /* Smooth transition for hover effect */

	&:hover {
		background-color: #0056b3; /* Darker blue on hover */
	}

	&:disabled {
		background-color: #d6d6d6; /* Gray background for disabled state */
		cursor: not-allowed; /* Not-allowed cursor */
	}
`;

export const PlaylistButton = styled.button`
	background-color: #28a745; /* Green background */
	color: white; /* White text */
	border: none; /* Remove border */
	border-radius: 5px; /* Rounded corners */
	padding: 10px 15px; /* Padding inside the button */
	cursor: pointer; /* Pointer cursor on hover */
	font-size: 16px; /* Font size */
	margin-top: 20px; /* Margin at the top */
	transition: background-color 0.3s ease; /* Smooth transition for hover effect */

	&:hover {
		background-color: #218838; /* Darker green on hover */
	}

	&:disabled {
		background-color: #d6d6d6; /* Gray background for disabled state */
		cursor: not-allowed; /* Not-allowed cursor */
	}
`;
