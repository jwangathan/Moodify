import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Element, ...rest }) => {
	const user = useSelector((state) => state.auth);

	return user ? <Element {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
