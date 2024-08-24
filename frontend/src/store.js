import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import notificationReducer from './reducers/notificationReducer';
import entryReducer from './reducers/entryReducer';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		entries: entryReducer,
		notification: notificationReducer,
	},
});
