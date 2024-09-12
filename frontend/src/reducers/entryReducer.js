import { createSlice, current } from '@reduxjs/toolkit';
import entryService from '../services/entries';

// user: {spotifyId}, situation, emotion, attributes,
// recommendations: {seedTracks, seedArtists, seedGenres, tracks: {id, name, artists: {id, name}, album: {id, name, image}, previewUrl, externalUrl}}
// playlist: { id, name }

const entrySlice = createSlice({
	name: 'entries',
	initialState: [],
	reducers: {
		updateEntry(state, action) {
			const id = action.payload.id;
			const playlist = action.payload.playlist;
			return state.map((entry) =>
				entry.id !== id ? entry : { ...entry, playlist: playlist }
			);
		},
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
		try {
			const res = await entryService.createEntry({
				seed_artists,
				seed_genres,
				seed_tracks,
				situation,
				emotion,
			});
			dispatch(appendEntry(res));
			return res;
		} catch (error) {
			console.log(error);
		}
	};
};

export const updatePlaylist = (id, selectedTracks) => {
	return async (dispatch) => {
		try {
			const newEntry = await entryService.managePlaylist(id, selectedTracks);
			dispatch(updateEntry(newEntry));
		} catch (error) {
			console.error(error);
		}
	};
};

export const { updateEntry, appendEntry, setEntries } = entrySlice.actions;
export default entrySlice.reducer;
