import { useLocation } from 'react-router-dom';

const PlaylistPage = () => {
	const location = useLocation();
	const mood = location.state;
	return (
		<div>
			<h1>{mood}</h1>
		</div>
	);
};

export default PlaylistPage;
