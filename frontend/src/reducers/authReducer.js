import { createSlice } from '@reduxjs/toolkit';
import login from '../services/login';

const authSlice = createSlice({
	name: 'authentication',
	initialState: null,
	reducers: {
		setUser(state, action) {
			return action.payload;
		},
		logout(state, action) {
			return null;
		},
	},
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.render;
