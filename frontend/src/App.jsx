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
import { setUser } from './reducers/authReducer';
import { initializeEntries } from './reducers/entryReducer';
import { Background } from './components/DivStyles';

function App() {
	const dispatch = useDispatch();
	const currUser = useSelector((state) => state.auth);
	const entries = useSelector((state) => state.entries);
	const { isVisible } = useSelector((state) => state.countdown);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			dispatch(setUser(user));
			dispatch(initializeEntries());
		}
	}, []);

	const matchEntry = useMatch('/entries/:id');
	const entry = matchEntry
		? entries.find((entry) => entry.id === matchEntry.params.id)
		: null;

	return (
		<Background>
			{currUser && <Navigation />}
			<Notification />
			{isVisible && <CountdownModal />}
			{currUser ? (
				<Routes>
					<Route path="/" element={<UserPage />} />
					<Route path="/survey" element={<QuestionPage />} />
					<Route path="/entries" element={<EntryList />} />
					<Route path="/entries/:id" element={<EntryView entry={entry} />} />
					<Route path="/entries/callback" element={<EntryCallbackPage />} />
				</Routes>
			) : (
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/auth/callback/*" element={<LoginCallbackPage />} />
				</Routes>
			)}
		</Background>
	);
}

export default App;
