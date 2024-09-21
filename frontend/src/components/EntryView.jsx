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
	const [selectedTrackIds, setSelectedTrackIds] = useState([]);

	const storedTracks = entry && entry.playlist.tracks;

	useEffect(() => {
		if (storedTracks && storedTracks.length > 0)
			setSelectedTrackIds(storedTracks);
	}, [storedTracks]);

	const toggleSelectedTrack = (trackId) =>
		setSelectedTrackIds((prevIds) =>
			prevIds.includes(trackId)
				? prevIds.filter((id) => id !== trackId)
				: [...prevIds, trackId]
		);

	const updateEntryPlaylist = async () => {
		dispatch(updatePlaylist(entry.id, selectedTrackIds));
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
						{entry.tracks.map((track) => (
							<Track
								key={track.id}
								track={track}
								onSelect={toggleSelectedTrack}
								isSelected={selectedTrackIds.includes(track.id)}
							/>
						))}
					</GridContainer>
					<PlaylistButton
						onClick={updateEntryPlaylist}
						disabled={selectedTrackIds.length === 0}
					>
						{selectedTrackIds.length > 0
							? 'Create/Update Playlist'
							: 'Select Songs to Create Playlist'}
					</PlaylistButton>
				</div>
			)}
		</div>
	);
};

export default EntryView;
