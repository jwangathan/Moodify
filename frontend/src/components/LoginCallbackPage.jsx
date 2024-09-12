import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../reducers/authReducer';
import { Spinner } from 'react-bootstrap';
import { initializeEntries } from '../reducers/entryReducer';
import { CenteredComponent } from './DivStyles';

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
					navigate('/');
				}
			} catch (error) {
				console.error('An unexpected error occurred: ', error);
				navigate('/');
			}
		};

		fetchData();
	}, [location.search, navigate, dispatch]);

	return (
		<CenteredComponent>
			<Spinner animation="border" />
			<span className="sr-only"> Logging in... </span>
		</CenteredComponent>
	);
};

export default LoginCallbackPage;
