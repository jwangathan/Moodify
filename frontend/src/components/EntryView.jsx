import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	updatePlaylist,
	deleteEntry,
	fetchEntryById,
} from '../reducers/entryReducer';

import {
	BackButton,
	RemoveButton,
	SelectAllButton,
	DeselectAllButton,
	ButtonContainer,
	GridContainer,
	TrackCard,
	TrackHeader,
	AlbumImage,
	TrackDetails,
	TrackName,
	ArtistName,
	AlbumName,
	SelectButton,
	PlaylistButton,
	AudioPlayer,
	Title,
} from './EntryViewStyles';

const Track = ({ track, onSelect, isSelected, isExpanded, toggleDetails }) => {
	return (
		<TrackCard onClick={toggleDetails}>
			<TrackHeader>
				<AlbumImage src={track.album.image} alt={`${track.album.name}`} />
				<TrackName>{track.name}</TrackName>
				<SelectButton onClick={() => onSelect(track.id)} selected={isSelected}>
					{isSelected ? 'Selected' : 'Add to Playlist'}
				</SelectButton>
			</TrackHeader>
			{isExpanded && (
				<TrackDetails>
					<ArtistName>
						{track.artists.map((artist) => artist.name).join(', ')}
					</ArtistName>
					<AlbumName>{track.album.name}</AlbumName>
					{track.previewUrl ? (
						<AudioPlayer controls>
							<source src={track.previewUrl} type="audio/mpeg" />
							Your browser does not support the audio element
						</AudioPlayer>
					) : (
						<p>Song preview unavailable</p>
					)}
				</TrackDetails>
			)}
		</TrackCard>
	);
};

const EntryView = ({ entry }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [selectedTrackIds, setSelectedTrackIds] = useState([]);
	const [originalTrackIds, setOriginalTrackIds] = useState([]);
	const [isUpdated, setIsUpdated] = useState(false);
	const [expandedTrackId, setExpandedTrackId] = useState(null);

	useEffect(() => {
		const fetchPlaylistState = async () => {
			if (entry && entry.playlist.id) {
				const { playlist } = await dispatch(fetchEntryById(entry.id)); //infinite loop because this updates entry
				if (playlist.selectedTracks) {
					setSelectedTrackIds(playlist.selectedTracks);
					setOriginalTrackIds(playlist.selectedTracks);
				}
			}
		};
		const storedTracks = entry?.playlist?.selectedTracks || [];
		setSelectedTrackIds(storedTracks);
		setOriginalTrackIds(storedTracks);

		fetchPlaylistState();
	}, [entry]);

	useEffect(() => {
		const idsMatch =
			selectedTrackIds.length === originalTrackIds.length &&
			selectedTrackIds.every((id) => originalTrackIds.includes(id));
		setIsUpdated(!idsMatch);
	}, [selectedTrackIds, originalTrackIds]);

	const handleSelect = (trackId) => {
		setSelectedTrackIds((prevIds) =>
			prevIds.includes(trackId)
				? prevIds.filter((id) => id !== trackId)
				: [...prevIds, trackId]
		);
	};

	const toggleDetails = (trackId) => {
		setExpandedTrackId((prevId) => (prevId === trackId ? null : trackId));
	};

	const updateEntryPlaylist = async () => {
		dispatch(updatePlaylist(entry.id, selectedTrackIds));
		setOriginalTrackIds(selectedTrackIds);
		setIsUpdated(false);
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
					<Title>Your Selected Tracks</Title>
					<BackButton onClick={() => navigate('/entries')}>
						Return to Entries
					</BackButton>
					<ButtonContainer>
						<RemoveButton
							onClick={() => {
								handleDelete(entry);
							}}
						>
							Remove Entry
						</RemoveButton>

						<div>
							<SelectAllButton
								onClick={() => {
									setSelectedTrackIds(entry.tracks.map((track) => track.id));
								}}
							>
								Select All
							</SelectAllButton>
							<DeselectAllButton
								onClick={() => {
									setSelectedTrackIds([]);
								}}
							>
								Deselect All
							</DeselectAllButton>
						</div>
					</ButtonContainer>
					<GridContainer>
						{entry.tracks.map((track) => (
							<Track
								key={track.id}
								track={track}
								onSelect={handleSelect}
								isSelected={selectedTrackIds.includes(track.id)}
								isExpanded={expandedTrackId === track.id}
								toggleDetails={() => toggleDetails(track.id)}
							/>
						))}
					</GridContainer>
					<PlaylistButton
						onClick={updateEntryPlaylist}
						disabled={
							(selectedTrackIds.length === 0 && !isUpdated) || !isUpdated
						}
					>
						{
							selectedTrackIds.length === 0
								? isUpdated
									? 'Update Playlist' // if updated and has no songs selected (deleted all songs)
									: 'Select Songs to Create Playlist' // if not updated and no songs (no playlist)
								: isUpdated
								? 'Update Playlist' // if updated and has songs selected (changes made)
								: 'Playlist has no changes' // if not updated and has songs selected (no changes made)
						}
					</PlaylistButton>
				</div>
			)}
		</div>
	);
};

export default EntryView;
