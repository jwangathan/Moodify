import { useSelector } from 'react-redux';
import {
	ListContainer,
	ListWrapper,
	ListHeader,
	OrderedList,
	Centered,
} from './UserPageStyles';

const UserPage = () => {
	const currUser = useSelector((state) => state.auth);

	return (
		<>
			{currUser && (
				<div>
					<Centered>
						<img
							src={currUser.user.profileImage}
							alt={`${currUser.user.displayName}'s profile`}
						/>
						<h1>{currUser.user.displayName}</h1>
					</Centered>
					<ListContainer>
						<ListWrapper>
							<ListHeader>Top Artists (Past 6 months)</ListHeader>
							<OrderedList>
								{currUser.topArtists.map((artist) => (
									<li key={artist.id}>{artist.name}</li>
								))}
							</OrderedList>
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Genres (Past 6 months)</ListHeader>
							<OrderedList>
								{currUser.topGenres.map((genre, index) => (
									<li key={index}>{genre}</li>
								))}
							</OrderedList>
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Tracks (Past 6 months)</ListHeader>
							<OrderedList>
								{currUser.topTracks.map((track) => (
									<li key={track.id}>
										{track.name} - {track.artists.join(', ')}
									</li>
								))}
							</OrderedList>
						</ListWrapper>
					</ListContainer>
				</div>
			)}
		</>
	);
};

export default UserPage;
