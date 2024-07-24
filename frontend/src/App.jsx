import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import PlaylistPage from './components/PlaylistPage';
import CallbackPage from './components/CallbackPage';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from './reducers/authReducer';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			dispatch(setUser(user));
		}
	}, [dispatch]);
	return (
		<div className="container">
			<Navigation />
			<Notification />
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route exact path="/survey" element={<QuestionPage />} />
				<Route exact path="/playlist" element={<PlaylistPage />} />
				<Route exact path="/callback" element={<CallbackPage />} />
			</Routes>
		</div>
	);
}

export default App;
