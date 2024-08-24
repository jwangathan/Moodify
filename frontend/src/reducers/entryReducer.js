import { createSlice } from '@reduxjs/toolkit';
import entryService from '../services/entries';

// user: {spotifyId}, situation, emotion, attributes,
// recommendations: {seedTracks, seedArtists, seedGenres, tracks: {id, name, artists: {id, name}, allbum: {id, name, image}, previewUrl, externalUrl}}
const entrySlice = createSlice({
	name: 'entries',
	initialState: [],
	reducers: {
		appendEntry(state, action) {
			state.push(action.payload);
		},
		setEntries(state, action) {
			return action.payload;
		},
	},
});

export const initializeEntries = () => {
	return async (dispatch) => {
		const entries = await entryService.getAll();
		dispatch(setEntries(entries));
	};
};

export const createEntry = (
	seed_artists,
	seed_genres,
	seed_tracks,
	situation,
	emotion
) => {
	return async (dispatch) => {
		entryService
			.create({
				seed_artists,
				seed_genres,
				seed_tracks,
				situation,
				emotion,
			})
			.then((res) => {
				dispatch(appendEntry(res));
			});
	};
};

export const { appendEntry, setEntries } = entrySlice.actions;
export default entrySlice.reducer;
