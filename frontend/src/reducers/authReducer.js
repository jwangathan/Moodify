import { createSlice } from '@reduxjs/toolkit';
import entryService from '../services/entries';
import userService from '../services/users';
import authService from '../services/auth';
import setRefreshTimeout from '../hooks/setRefreshTimeout';
import { initializeEntries } from './entryReducer';
import { displayNotification } from './notificationReducer';

/*
values
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
*/

const initialState = {
	loading: true,
	user: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setLoading(state, action) {
			state.loading = action.payload;
		},
		setUser(state, action) {
			const newState = { ...state.user, ...action.payload };
			const expiresIn = newState.expiresAt - Math.floor(Date.now() / 1000);
			state.user = { ...newState, expiresIn };

			const currUser = JSON.stringify(state.user);

			window.localStorage.setItem('user', currUser);
			if (newState.token) {
				entryService.setToken(newState.token);
				userService.setToken(newState.token);
			}
			state.loading = false;
		},
		logout(state, action) {
			window.localStorage.clear();
			entryService.resetToken();
			userService.resetToken();
			state.loading = false;
			return initialState;
		},
	},
});

export const loginUser = (code) => {
	return async (dispatch, getState) => {
		try {
			dispatch(setLoading(true));
			const res = await authService.getUser({ code });
			await dispatch(setUser(res));

			const { auth } = getState();
			setRefreshTimeout({
				dispatch,
				expiresIn: auth.expiresAt - Math.floor(Date.now() / 1000),
			});

			dispatch(
				displayNotification(
					`${auth.user.displayName} has been logged in.`,
					'success',
					3
				)
			);
		} catch (error) {
			dispatch(
				displayNotification('There was an error logging in.', 'error', 3)
			);
			dispatch(logout());
		} finally {
			dispatch(setLoading(false));
		}
	};
};

export const refreshToken = () => {
	return async (dispatch, getState) => {
		try {
			dispatch(setLoading(true));
			const { auth } = getState();
			const res = await authService.refresh({ spotifyId: auth.user.spotifyId });
			dispatch(setUser(res));
			setRefreshTimeout({
				dispatch,
				expiresIn: res.expiresAt - Math.floor(Date.now() / 1000),
			});

			dispatch(
				displayNotification('Your session has been refreshed.', 'success', 3)
			);
		} catch (error) {
			console.error('Failed to refresh token: ', error);
			dispatch(
				displayNotification(
					'There has been an error refreshing your session. Please log in again.',
					'error',
					3
				)
			);
			dispatch(logout());
		} finally {
			dispatch(setLoading(false));
		}
	};
};

export const restoreUser = (parsedUser) => {
	return async (dispatch) => {
		try {
			dispatch(setLoading(true));
			dispatch(setUser(parsedUser));
			dispatch(initializeEntries());
			dispatch(
				displayNotification('Your session has been restored.', 'success', 3)
			);
			const timeRemaining =
				parsedUser.expiresAt - Math.floor(Date.now() / 1000);
			console.log('TIME REMAINING: ', timeRemaining);
			setRefreshTimeout({
				dispatch,
				expiresIn: timeRemaining,
			});
		} catch (error) {
			console.error('Failed to restore user: ', error);
			dispatch(
				displayNotification(
					'There has been an error restoring your session. Please log in again.',
					'error',
					3
				)
			);
			dispatch(logout());
		} finally {
			dispatch(setLoading(false));
		}
	};
};

export const { setLoading, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
