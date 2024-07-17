import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Callback = () => {
	const location = useLocation();
	const navigate = useNavigate();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const params = new URLSearchParams(location.search);
				const code = params.get('code');
				if (code) {
					const res = await axios.get('/api/auth/callback', {
						params: { code },
					});

					console.log(res.data);
					navigate('/survey');
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [location.search, navigate]);

	return (
		<div>
			<h1>Logging in...</h1>
		</div>
	);
};

export default Callback;
