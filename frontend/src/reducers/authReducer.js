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
			window.localStorage.setItem('user', JSON.stringify(newState));
			if (newState.token) {
				console.log('SETTING TOKEN');
				entryService.setToken(newState.token);
			}
			console.log(newState);
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
	return async (dispatch) => {
		try {
			const res = await authService.refresh();
			dispatch(setUser(res));
			setRefreshTimeout({ dispatch, expiresIn: res.expiresIn });
		} catch (error) {
			console.error('Failed to refresh token: ', error);
			dispatch(logout());
		}
	};
};

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
