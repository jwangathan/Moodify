import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEntry } from '../reducers/entryReducer';

import Spinner from './Spinner';

const EntryCallbackPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (location.state?.situation && location.state?.emotion) {
					const { situation, emotion } = location.state;
					const seed_artists = user.topArtists
						.slice(0, 2)
						.map((artist) => artist.id)
						.join();
					const seed_tracks = user.topTracks[0].id;
					const seed_genres = user.topGenres.slice(0, 2).join();
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

	return <Spinner message={'Creating Entry...'} />;
};

export default EntryCallbackPage;
