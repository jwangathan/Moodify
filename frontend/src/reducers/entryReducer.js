import { createSlice } from '@reduxjs/toolkit';
import entryService from '../services/entries';

// user: {spotifyId}, situation, emotion, attributes,
// tracks: {id, name, artists: {id, name}, album: {id, name, image}, previewUrl, externalUrl}}
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
		removeEntry(state, action) {
			const id = action.payload;
			const newEntryList = state.filter((e) => e.id !== id);
			return newEntryList;
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
			const newEntry = await entryService.updatePlaylist(id, selectedTracks);
			dispatch(updateEntry(newEntry));
		} catch (error) {
			console.error(error);
		}
	};
};

// export const fetchEntryById = (id) => {
// 	return async (dispatch) => {
// 		try {
// 			const res = await entryService.getEntry(id)
// 			dispatch()
// 		}
// 	}
// }

export const deleteEntry = (id) => {
	return async (dispatch) => {
		await entryService.deleteEntry(id);
		dispatch(removeEntry(id));
	};
};

export const { updateEntry, appendEntry, setEntries, removeEntry } =
	entrySlice.actions;
export default entrySlice.reducer;
