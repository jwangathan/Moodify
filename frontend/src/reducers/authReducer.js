import { createSlice } from '@reduxjs/toolkit';
import entryService from '../services/entries';
import userService from '../services/users';
import authService from '../services/auth';
import setRefreshTimeout from '../hooks/setRefreshTimeout';
import { initializeEntries } from './entryReducer';

/*
const initialState = {
	token: null,
	expiresAt: null,
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
			const currUser = JSON.stringify({
				spotifyId: newState.user.spotifyId,
				token: newState.token,
				expiresAt: newState.expiresAt,
				expiresIn: newState.expiresAt - Math.floor(Date.now() / 1000),
			});
			window.localStorage.setItem('user', currUser);
			if (newState.token) {
				entryService.setToken(newState.token);
				userService.setToken(newState.token);
			}
			return newState;
		},
		logout(state, action) {
			window.localStorage.clear();
			entryService.resetToken();
			userService.resetToken();
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
			setRefreshTimeout({
				dispatch,
				expiresIn: auth.expiresAt - Math.floor(Date.now() / 1000),
			});
		} catch (error) {
			console.error('Failed to login User: ', error);
			dispatch(logout());
		}
	};
};

export const refreshToken = () => {
	return async (dispatch, getState) => {
		try {
			const { auth } = getState();
			const res = await authService.refresh({ spotifyId: auth.user.spotifyId });
			dispatch(setUser(res));
			setRefreshTimeout({
				dispatch,
				expiresIn: res.expiresAt - Math.floor(Date.now() / 1000),
			});
		} catch (error) {
			console.error('Failed to refresh token: ', error);
			dispatch(logout());
		}
	};
};

export const restoreUser = (spotifyId) => {
	return async (dispatch) => {
		try {
			const res = await userService.getUserById(spotifyId);
			dispatch(setUser(res));
			dispatch(initializeEntries());
		} catch (error) {
			console.error('Failed to restore user: ', error);
			dispatch(logout());
		}
	};
};

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
