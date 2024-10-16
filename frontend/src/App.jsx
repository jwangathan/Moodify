import { Routes, Route, useMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Navigation from './components/Navigation';
import Notification from './components/Notification';
import CountdownModal from './components/CountdownModal';
import LoginPage from './components/LoginPage';
import LoginCallbackPage from './components/LoginCallbackPage';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import EntryCallbackPage from './components/EntryCallbackPage';
import EntryList from './components/EntryList';
import EntryView from './components/EntryView';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import { Background, ContentWrapper } from './AppStyles';
import useSession from './hooks/useSession';

const App = () => {
	const dispatch = useDispatch();
	const user = useSession();
	const entries = useSelector((state) => state.entries);
	const { loading } = useSelector((state) => state.auth);
	const { isCountdownVisible } = useSelector((state) => state.countdown);

	useEffect(() => {
		if (user && user.expiresAt - Math.floor(Date.now() / 1000) <= 300) {
			dispatch(refreshToken());
		}
	}, [user, dispatch]);

	const entryMatch = useMatch('/entries/:id');
	const entryId = entryMatch ? entryMatch.params.id : null;
	const selectedEntry = entryMatch
		? entries.find((entry) => entry.id === entryId)
		: null;

	return (
		<Background>
			{user && <Navigation />}
			<Notification />
			{isCountdownVisible && <CountdownModal />}
			<ContentWrapper>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route path="/auth/callback" element={<LoginCallbackPage />} />
					<Route path="/home" element={<ProtectedRoute element={HomePage} />} />
					<Route
						path="/survey"
						element={<ProtectedRoute element={QuestionPage} />}
					/>
					<Route
						path="/entries"
						element={<ProtectedRoute element={EntryList} />}
					/>
					<Route
						path="/entries/:id"
						element={
							<ProtectedRoute element={EntryView} entry={selectedEntry} />
						}
					/>
					<Route
						path="/entries/callback"
						element={<ProtectedRoute element={EntryCallbackPage} />}
					/>
				</Routes>
			</ContentWrapper>
			<Footer />
		</Background>
	);
};

export default App;
