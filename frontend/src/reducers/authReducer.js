import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';
import entryService from '../services/entries';

/*
state includes:
token, refreshToken, expiresIn, user: {spotifyId, displayName, profileImage}, topArtists, topGenres, topTracks
*/
const authSlice = createSlice({
	name: 'auth',
	initialState: null,
	reducers: {
		setUser(state, action) {
			window.localStorage.setItem('loggedUser', JSON.stringify(action.payload));
			entryService.setToken(action.payload.token);
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
