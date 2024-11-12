import { useSelector } from 'react-redux';
import {
	ListContainer,
	ListWrapper,
	ListHeader,
	ListItem,
	OrderedList,
	Centered,
} from './HomePageStyles';

const HomePage = () => {
	const { user } = useSelector((state) => state.auth);

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
								{user.topArtists.map((artist, index) => (
									<ListItem
										key={artist.id}
										onClick={() => window.open(artist.url, '_blank')}
										delay={`${index * 0.2}s`}
									>
										{artist.name}
									</ListItem>
								))}
							</OrderedList>
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Genres (Past 6 months)</ListHeader>
							<OrderedList>
								{user.topGenres.map((genre, index) => (
									<ListItem key={index} delay={`${index * 0.2}s`}>
										{genre}
									</ListItem>
								))}
							</OrderedList>
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Tracks (Past 6 months)</ListHeader>
							<OrderedList>
								{user.topTracks.map((track, index) => (
									<ListItem
										key={track.id}
										onClick={() => window.open(track.url, '_blank')}
										delay={`${index * 0.2}s`}
									>
										{track.name} - {track.artists.join(', ')}
									</ListItem>
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
