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
						<img src={user.user.profileImage} alt={'Add a profile image!'} />
						<h1>{user.user.displayName}</h1>
					</Centered>
					<ListContainer>
						<ListWrapper>
							<ListHeader>Top Artists (Past 6 months)</ListHeader>
							{user.topArtists.length > 0 ? (
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
							) : (
								<p>Listen to some songs to find your top artists!</p>
							)}
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Genres (Past 6 months)</ListHeader>
							{user.topGenres.length > 0 ? (
								<OrderedList>
									{user.topGenres.map((genre, index) => (
										<ListItem key={index} delay={`${index * 0.2}s`}>
											{genre}
										</ListItem>
									))}
								</OrderedList>
							) : (
								<p>Listen to some songs to find your top genres!</p>
							)}
						</ListWrapper>
						<ListWrapper>
							<ListHeader>Top Tracks (Past 6 months)</ListHeader>
							{user.topTracks.length > 0 ? (
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
							) : (
								<p>Listen to some songs to find your top tracks!</p>
							)}
						</ListWrapper>
					</ListContainer>
				</div>
			)}
		</>
	);
};

export default HomePage;
