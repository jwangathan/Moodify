import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import notificationReducer from './reducers/notificationReducer';
import entryReducer from './reducers/entryReducer';
import countdownReducer from './reducers/countdownReducer';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		countdown: countdownReducer,
		entries: entryReducer,
		notification: notificationReducer,
	},
});
