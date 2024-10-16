import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const ProtectedRoute = ({ element: Element, ...rest }) => {
	const { user, loading } = useSelector((state) => state.auth);

	if (loading) {
		return <Spinner message="Loading..." />;
	}

	return user ? <Element {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
