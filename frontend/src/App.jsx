import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import PlaylistPage from './components/PlaylistPage';
import Callback from './components/Callback';

function App() {
	return (
		<div>
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route exact path="/survey" element={<QuestionPage />} />
				<Route exact path="/playlist" element={<PlaylistPage />} />
				<Route exact path="/callback" element={<Callback />} />
			</Routes>
		</div>
	);
}

export default App;
