import { useSelector } from 'react-redux';
import { CgCloseO, CgDanger, CgCheckO } from 'react-icons/cg';

const Notification = () => {
	const notification = useSelector((state) => state.notification);

	const renderNotification = () => {
		switch (notification.type) {
			case 'success':
				return (
					<Success>
						<CgCheckO />
						{notification.message}
					</Success>
				);
			case 'error':
				return (
					<Error>
						<CgDanger />
						{notification.message}
					</Error>
				);
			case 'warning':
				return (
					<Warning>
						<CgCloseO />
						{notification.message}
					</Warning>
				);
			default:
				return null;
		}
	};
	return <div>{renderNotification()}</div>;
};

export default Notification;
