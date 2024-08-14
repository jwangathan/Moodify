import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';

const PlaylistCallbackPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const spotifyId = useSelector((state) => state.auth.user.spotifyId);
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (location.state?.playlist) {
					const { situation, emotion } = location.state;
					const res = await axios.post('/api/chat', {
						spotifyId,
						situation,
						emotion,
						token,
					});
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
