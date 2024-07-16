import axios from 'axios';
const HomePage = () => {
	const handleLogin = async () => {
		try {
			const res = await axios.get('/api/auth/login');
			console.log(res.data);
			window.location.href = res.data;
		} catch (error) {
			console.log('Error during login: ', error);
		}
	};

	return (
		<div>
			<button onClick={handleLogin}> login </button>
		</div>
	);
};

export default HomePage;
