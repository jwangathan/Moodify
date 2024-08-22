import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import chatService from '../services/chats';

const PlaylistCallbackPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currUser = useSelector((state) => state.auth);
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (location.state?.playlist) {
					const { situation, emotion } = location.state;
					const artists = currUser.topArtists
						.slice(0, 2)
						.map((artist) => artist.id)
						.join();
					const tracks = currUser.topTracks[0].id;
					const genres = currUser.topGenres.slice(0, 2).join();
					const res = chatService.create({
						seed_artists: artists,
						seed_genres: genres,
						seed_tracks: tracks,
						situation,
						emotion,
					});
					// const res = await axios.post('/api/chat', {
					// 	seed_artists: artists || '',
					// 	seed_tracks: tracks || '',
					// 	seed_genres: genres || '',
					// 	situation,
					// 	emotion,
					// });
					console.log(res);
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

export default PlaylistCallbackPage;
