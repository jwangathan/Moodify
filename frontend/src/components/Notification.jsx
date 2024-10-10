import { useSelector } from 'react-redux';
import { Alert } from './NotificationStyles';

const Notification = () => {
	const notification = useSelector((state) => state.notification);

	const renderNotification = () => {
		switch (notification.type) {
			case 'success':
				return <Success>{notification.message}</Success>;
			case 'error':
				return <Error>{notification.message}</Error>;
			case 'warning':
				return <Warning>{notification.message}</Warning>;
			default:
				return null;
		}
	};
	return <div>{renderNotification()}</div>;
};

export default Notification;
