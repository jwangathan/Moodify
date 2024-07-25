import { useLocation } from 'react-router-dom';

const PlaylistPage = () => {
	const location = useLocation();
	const mood = location.state.mood;
	const event = location.state.event;
	return (
		<div>
			<h1>{mood}</h1>
			<h1>{event}</h1>
		</div>
	);
};

export default PlaylistPage;
