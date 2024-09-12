import { useState, useEffect } from 'react';
import { ModalBackground, ModalContainer, Countdown } from './ModalStyles';
import { useDispatch } from 'react-redux';
import { logout, refreshToken } from '../reducers/authReducer';
import { setCountdownDisplay } from '../reducers/countdownReducer';

const CountdownModal = () => {
	const dispatch = useDispatch();
	const [timeLeft, setTimeLeft] = useState(60);
	const handleConfirm = () => {
		dispatch(refreshToken());
		dispatch(setCountdownDisplay(false));
	};

	const handleCancel = () => {
		dispatch(logout());
		dispatch(setCountdownDisplay(false));
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((prevTime) => prevTime - 1);
		}, 1000);

		if (timeLeft === 0) {
			clearInterval(interval);
			handleCancel();
		}

		return () => clearInterval(interval);
	}, [timeLeft, handleCancel]);

	return (
		<ModalBackground>
			<ModalContainer>
				<Countdown>Your session will expire in {timeLeft} seconds.</Countdown>
				<button onClick={handleConfirm}>Stay Logged In</button>
				<button onClick={handleCancel}>Log Out</button>
			</ModalContainer>
		</ModalBackground>
	);
};

export default CountdownModal;
