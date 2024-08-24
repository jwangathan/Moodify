import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import EntryList from './components/EntryList';
import LoginCallbackPage from './components/LoginCallbackPage';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from './reducers/authReducer';
import { initializeEntries } from './reducers/entryReducer';
import { Background } from './components/DivStyles';
import PlaylistCallbackPage from './components/PlaylistCallbackPage';
import UserPage from './components/UserPage';

function App() {
	const dispatch = useDispatch();
	const currUser = useSelector((state) => state.auth);
	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			dispatch(setUser(user));
		}
	}, [dispatch]);

	useEffect(() => {
		dispatch(initializeEntries());
	}, []);

	return (
		<Background>
			{currUser && <Navigation />}
			<Notification />
			{currUser ? (
				<Routes>
					<Route path="/" element={<UserPage />} />
					<Route path="/survey" element={<QuestionPage />} />
					<Route path="/playlist" element={<EntryList currUser={currUser} />} />
					<Route path="/playlist/callback" element={<PlaylistCallbackPage />} />
				</Routes>
			) : (
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/auth/callback" element={<LoginCallbackPage />} />
				</Routes>
			)}
		</Background>
	);
}

export default App;
