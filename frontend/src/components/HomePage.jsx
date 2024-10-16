import { useSelector } from 'react-redux';
import {
	ListContainer,
	ListWrapper,
	ListHeader,
	OrderedList,
	Centered,
} from './HomePageStyles';
import Spinner from './Spinner';

const HomePage = () => {
	const user = useSelector((state) => state.auth);

	return (
		<>
			{user && (
				<div>
					<Centered>
						<img
							src={user.user.profileImage}
							alt={`${user.user.displayName}'s profile`}
						/>
						<h1>{user.user.displayName}</h1>
					</Centered>
					<ListContainer>
						<ListWrapper>
							<ListHeader>Top Artists (Past 6 months)</ListHeader>
							<OrderedList>
								{user.topArtists.map((artist) => (
									<li key={artist.id}>{artist.name}</li>
								))}
							</OrderedList>
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Genres (Past 6 months)</ListHeader>
							<OrderedList>
								{user.topGenres.map((genre, index) => (
									<li key={index}>{genre}</li>
								))}
							</OrderedList>
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Tracks (Past 6 months)</ListHeader>
							<OrderedList>
								{user.topTracks.map((track) => (
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

export default HomePage;
