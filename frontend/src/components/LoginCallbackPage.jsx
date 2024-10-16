import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/authReducer';
import { initializeEntries } from '../reducers/entryReducer';

import Spinner from './Spinner';

const LoginCallbackPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const params = new URLSearchParams(location.search);
				const error = params.get('error');
				const errorDescription = params.get('error_description');
				if (error) {
					console.error(`Spotify OAuth error: ${error} - ${errorDescription}`);
					navigate('/');
					return;
				}

				const code = params.get('code');
				if (code) {
					await dispatch(loginUser(code));
					await dispatch(initializeEntries());
					navigate('/home');
				}
			} catch (error) {
				console.error('An unexpected error occurred: ', error);
				navigate('/');
			}
		};

		fetchData();
	}, [location.search, navigate, dispatch]);

	return <Spinner message={'Logging in...'} />;
};

export default LoginCallbackPage;
