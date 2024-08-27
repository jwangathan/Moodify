import {
	BackButton,
	GridContainer,
	TrackContainer,
	AlbumImage,
	TrackDetails,
	TrackName,
	ArtistName,
	AlbumName,
} from './EntryStyles';
import { useNavigate } from 'react-router-dom';

const EntryView = ({ entry }) => {
	const navigate = useNavigate();
	return (
		<div>
			{entry && (
				<div>
					<h1>Your Playlist</h1>
					<BackButton onClick={() => navigate('/entries')}>
						Return to Entries
					</BackButton>
					<GridContainer>
						{entry.recommendations.tracks.map((track, index) => (
							<TrackContainer key={track.id}>
								<AlbumImage
									src={track.album.image}
									alt={`${track.album.name}`}
								/>
								<TrackDetails>
									<TrackName>{track.name}</TrackName>
									<ArtistName>
										{track.artists.map((artist) => artist.name).join(', ')}
									</ArtistName>
									<AlbumName>{track.album.name}</AlbumName>
								</TrackDetails>
							</TrackContainer>
						))}
					</GridContainer>
				</div>
			)}
		</div>
	);
};

export default EntryView;
