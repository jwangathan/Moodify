import { Routes, Route, useMatch } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginCallbackPage from './components/LoginCallbackPage';
import Navigation from './components/Navigation';
import UserPage from './components/UserPage';
import QuestionPage from './components/QuestionPage';
import EntryList from './components/EntryList';
import EntryView from './components/EntryView';
import EntryCallbackPage from './components/EntryCallbackPage';
import Notification from './components/Notification';
import CountdownModal from './components/CountdownModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { restoreUser, logout } from './reducers/authReducer';
import { Background } from './components/DivStyles';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth);
	const entries = useSelector((state) => state.entries);
	const { isCountdownVisible } = useSelector((state) => state.countdown);

	const entryMatch = useMatch('/entries/:id');
	const entryId = entryMatch ? entryMatch.params.id : null;
	const selectedEntry = entryMatch
		? entries.find((entry) => entry.id === entryId)
		: null;

	useEffect(() => {
		const storedUser = window.localStorage.getItem('user');
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			if (parsedUser.expiresAt <= Math.floor(Date.now() / 1000)) {
				//if the session is expired, log out
				dispatch(logout());
			} else {
				dispatch(restoreUser(parsedUser.spotifyId));
			}
		}
	}, []);

	return (
		<Background>
			{user && <Navigation />}
			<Notification />
			{isCountdownVisible && <CountdownModal />}
			<Routes>
				<Route path="/auth/callback" element={<LoginCallbackPage />} />
				{user ? (
					<>
						<Route path="/" element={<UserPage />} />
						<Route path="/survey" element={<QuestionPage />} />
						<Route path="/entries" element={<EntryList />} />
						<Route
							path="/entries/:id"
							element={<EntryView entry={selectedEntry} />}
						/>
						<Route path="/entries/callback" element={<EntryCallbackPage />} />
					</>
				) : (
					<>
						<Route path="/" element={<HomePage />} />
					</>
				)}
			</Routes>
		</Background>
	);
};

export default App;
