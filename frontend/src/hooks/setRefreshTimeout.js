import { setCountdownDisplay } from '../reducers/countdownReducer';

const setRefreshTimeout = ({ dispatch, expiresIn }) => {
	const promptTime = expiresIn - 60; // appears 1 minutes before

	if (promptTime > 0) {
		setTimeout(() => {
			dispatch(setCountdownDisplay(true));
		}, promptTime * 1000);
	} else {
		dispatch(setCountdownDisplay(true));
	}
};

export default setRefreshTimeout;
