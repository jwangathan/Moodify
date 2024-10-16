import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser, logout } from '../reducers/authReducer';
import { displayNotification } from '../reducers/notificationReducer';

const useSession = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth);

	useEffect(() => {
		const storedUser = window.localStorage.getItem('user');
		if (storedUser) {
			const parsedUser = JSON.parse(storedUser);
			if (parsedUser.expiresAt <= Math.floor(Date.now() / 1000)) {
				//if the session is expired, log out
				dispatch(logout());
				dispatch(displayNotification('Your session has expired.', 'error', 3));
			} else {
				dispatch(restoreUser(parsedUser));
			}
		}
	}, [dispatch]);

	return user;
};

export default useSession;
