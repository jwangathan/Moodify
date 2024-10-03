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
import {
	updatePlaylist,
	deleteEntry,
	fetchEntryById,
} from '../reducers/entryReducer';

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
				{track.previewUrl ? (
					<audio controls>
						<source src={track.previewUrl} type="audio/mpeg" />
						Your browser does not support the audio element
					</audio>
				) : (
					<p>Song preview unavailable</p>
				)}
				<SelectButton onClick={() => onSelect(track.id)} selected={isSelected}>
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

	useEffect(() => {
		const fetchPlaylistState = async () => {
			if (entry && entry.playlist.id) {
				const { playlist } = await dispatch(fetchEntryById(entry.id)); //infinite loop because this updates entry
				if (playlist.selectedTracks) {
					setSelectedTrackIds(playlist.selectedTracks);
				}
			}
		};
		console.log('HELLO');
		const storedTracks = entry?.playlist?.selectedTracks || [];
		setSelectedTrackIds(storedTracks);

		fetchPlaylistState();
	}, [entry]);

	const handleSelect = (trackId) => {
		setSelectedTrackIds((prevIds) =>
			prevIds.includes(trackId)
				? prevIds.filter((id) => id !== trackId)
				: [...prevIds, trackId]
		);
	};

	const updateEntryPlaylist = async () => {
		dispatch(updatePlaylist(entry.id, selectedTrackIds));
	};

	const handleDelete = (entry) => {
		if (window.confirm('Are you sure you want to delete this entry?')) {
			dispatch(deleteEntry(entry.id));
			navigate('/entries');
		}
	};

	return (
		<div>
			{entry && (
				<div>
					<h1>Your Playlist</h1>
					<BackButton onClick={() => navigate('/entries')}>
						Return to Entries
					</BackButton>
					<button
						onClick={() => {
							handleDelete(entry);
						}}
					>
						Remove Entry
					</button>
					<GridContainer>
						{entry.tracks.map((track) => (
							<Track
								key={track.id}
								track={track}
								onSelect={handleSelect}
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
