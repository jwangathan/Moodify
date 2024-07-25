import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';

const authSlice = createSlice({
	name: 'authentication',
	initialState: null,
	reducers: {
		setUser(state, action) {
			window.localStorage.setItem('loggedUser', JSON.stringify(action.payload));
			userService.setToken(action.payload.accessToken);
			return action.payload;
		},
		logout(state, action) {
			window.localStorage.clear();
			return null;
		},
	},
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
