const HomePage = () => {
	const handleLogin = async () => {
		window.location.href = 'http://localhost:3001/auth/login';
	};

	return (
		<div>
			<button onClick={handleLogin}> login </button>
		</div>
	);
};

export default HomePage;
