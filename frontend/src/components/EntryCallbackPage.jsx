import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { createEntry } from '../reducers/entryReducer';

const EntryCallbackPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currUser = useSelector((state) => state.auth);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (location.state?.situation && location.state?.emotion) {
					const { situation, emotion } = location.state;
					const seed_artists = currUser.topArtists
						.slice(0, 2)
						.map((artist) => artist.id)
						.join();
					const seed_tracks = currUser.topTracks[0].id;
					const seed_genres = currUser.topGenres.slice(0, 2).join();
					const newEntry = await dispatch(
						createEntry(
							seed_artists,
							seed_genres,
							seed_tracks,
							situation,
							emotion
						)
					);

					navigate(`/entries/${newEntry.id}`);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, [location.search, navigate, dispatch]);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<Spinner animation="border" />
			<span className="sr-only"> Creating Playlist... </span>
		</div>
	);
};

export default EntryCallbackPage;