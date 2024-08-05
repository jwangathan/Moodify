import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionPage';
import PlaylistPage from './components/PlaylistPage';
import LoginCallbackPage from './components/LoginCallbackPage';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from './reducers/authReducer';
import { Div } from './components/DivStyles';
import PlaylistCallbackPage from './components/PlaylistCallbackPage';

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
	return (
		<div>
			{currUser && <Navigation />}
			<Notification />
			<Div>
				{currUser ? (
					<Routes>
						<Route exact path="/" element={<QuestionPage />} />
						<Route exact path="/playlist" element={<PlaylistPage />} />
						<Route
							exact
							path="/playlist/callback"
							element={<PlaylistCallbackPage currUser={currUser} />}
						/>
					</Routes>
				) : (
					<Routes>
						<Route exact path="/" element={<HomePage />} />
						<Route
							exact
							path="/auth/callback"
							element={<LoginCallbackPage />}
						/>
					</Routes>
				)}
			</Div>
		</div>
	);
}

export default App;
