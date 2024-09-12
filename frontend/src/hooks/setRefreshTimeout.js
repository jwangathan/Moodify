import { setCountdownDisplay } from '../reducers/countdownReducer';

const setRefreshTimeout = ({ dispatch, expiresIn }) => {
	const promptTime = (expiresIn - 60) * 1000;

	if (promptTime > 0) {
		setTimeout(() => {
			dispatch(setCountdownDisplay(true));
		}, promptTime);
	} else {
		dispatch(setCountdownDisplay(true));
	}
};

export default setRefreshTimeout;
