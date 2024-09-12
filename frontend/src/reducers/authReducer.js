import { createSlice } from '@reduxjs/toolkit';
import entryService from '../services/entries';
import authService from '../services/auth';
import setRefreshTimeout from '../hooks/setRefreshTimeout';

/*
const initialState = {
	token: null,
	expiresIn: null,
	topArtists: null,
	topGenres: null,
	topTracks: null,
	user: {
		spotifyId: null,
		displayName: null,
		profileImage: null,
	},
}; 
*/

const authSlice = createSlice({
	name: 'auth',
	initialState: null,
	reducers: {
		setUser(state, action) {
			const newState = { ...state, ...action.payload };
			window.localStorage.setItem('loggedUser', JSON.stringify(newState));
			if (newState.token) entryService.setToken(newState.token);
			return newState;
		},
		logout(state, action) {
			window.localStorage.clear();
			return null;
		},
	},
});

export const loginUser = (code) => {
	return async (dispatch, getState) => {
		try {
			const res = await authService.getUser({ code });
			await dispatch(setUser(res));
			const { auth } = getState();
			setRefreshTimeout({ dispatch, expiresIn: auth.expiresIn });
		} catch (error) {
			console.error('Failed to login User: ', error);
			dispatch(logout());
		}
	};
};

export const refreshToken = () => {
	return async (dispatch, getState) => {
		try {
			var { auth } = getState();
			const res = await authService.refresh({ spotifyId: auth.user.spotifyId });
			dispatch(setUser(res));
			auth = getState();
			setRefreshTimeout({ dispatch, expiresIn: auth.expiresIn });
		} catch (error) {
			console.error('Failed to refresh token: ', error);
			dispatch(logout());
		}
	};
};

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
