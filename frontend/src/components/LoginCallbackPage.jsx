import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/authReducer';
import { Spinner } from 'react-bootstrap';

const LoginCallbackPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const params = new URLSearchParams(location.search);
				const code = params.get('code');
				if (code) {
					const res = await authService.getUser({ code });
					dispatch(setUser(res));
					navigate('/');
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, [location.search, navigate, dispatch]);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<Spinner animation="border" />
			<span className="sr-only"> Logging in... </span>
		</div>
	);
};

export default LoginCallbackPage;
