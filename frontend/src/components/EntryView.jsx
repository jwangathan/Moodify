import {
	BackButton,
	GridContainer,
	TrackContainer,
	AlbumImage,
	TrackDetails,
	TrackName,
	ArtistName,
	AlbumName,
	SelectButton,
	PlaylistButton,
} from './EntryStyles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePlaylist } from '../reducers/entryReducer';

const Track = ({ track, onSelect, isSelected }) => {
	return (
		<TrackContainer>
			<AlbumImage src={track.album.image} alt={`${track.album.name}`} />
			<TrackDetails>
				<TrackName>{track.name}</TrackName>
				<ArtistName>
					{track.artists.map((artist) => artist.name).join(', ')}
				</ArtistName>
				<AlbumName>{track.album.name}</AlbumName>
				{track.previewUrl && (
					<audio controls>
						<source src={track.previewUrl} type="audio/mpeg" />
						Your browser does not support the audio element
					</audio>
				)}
				<SelectButton onClick={() => onSelect(track)} selected={isSelected}>
					{isSelected ? 'Selected' : 'Add to Playlist'}
				</SelectButton>
			</TrackDetails>
		</TrackContainer>
	);
};

const EntryView = ({ entry }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [selectedTracks, setSelectedTracks] = useState([]); //contains trackIds
	const storedTracks = entry.playlist.tracks;
	useEffect(() => {
		if (storedTracks && storedTracks.length > 0)
			setSelectedTracks(storedTracks);
	}, [storedTracks]);

	const handleSelectTracks = (track) => {
		setSelectedTracks((prevSelected) => {
			if (prevSelected.includes(track.id)) {
				console.log('removed');
				return prevSelected.filter((tId) => tId !== track.id);
			} else {
				console.log('added');
				return [...prevSelected, track.id];
			}
		});
	};

	const handlePlaylistUpdate = async () => {
		dispatch(updatePlaylist(entry.id, selectedTracks));
	};

	return (
		<div>
			{entry && (
				<div>
					<h1>Your Playlist</h1>
					<BackButton onClick={() => navigate('/entries')}>
						Return to Entries
					</BackButton>
					<GridContainer>
						{entry.recommendations.tracks.map((track) => (
							<Track
								key={track.id}
								track={track}
								onSelect={handleSelectTracks}
								isSelected={selectedTracks.some((t) => t === track.id)}
							/>
						))}
					</GridContainer>
					<PlaylistButton
						onClick={handlePlaylistUpdate}
						disabled={selectedTracks.length === 0}
					>
						{selectedTracks.length > 0
							? 'Create/Update Playlist'
							: 'Select Songs to Create Playlist'}
					</PlaylistButton>
				</div>
			)}
		</div>
	);
};

export default EntryView;
