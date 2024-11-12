import { createSlice } from '@reduxjs/toolkit';
import entryService from '../services/entries';
import { displayNotification } from './notificationReducer';

// user: {spotifyId}, situation, emotion, attributes,
// tracks: {id, name, artists: {id, name}, album: {id, name, image}, previewUrl, externalUrl}}
// playlist: { id, snapshot, selectedTracks, url }

const entrySlice = createSlice({
	name: 'entries',
	initialState: [],
	reducers: {
		updateEntry(state, action) {
			const id = action.payload.id;
			const newEntry = action.payload.entry;
			return state.map((entry) => (entry.id !== id ? entry : newEntry));
		},
		appendEntry(state, action) {
			state.push(action.payload);
		},
		setEntries(state, action) {
			return action.payload;
		},
		removeEntry(state, action) {
			const id = action.payload;
			return state.filter((e) => e.id !== id);
		},
	},
});

export const initializeEntries = () => {
	return async (dispatch) => {
		try {
			const entries = await entryService.getAll();
			dispatch(setEntries(entries));
		} catch (err) {
			console.log(err);
			dispatch(
				displayNotification(
					'There was an error fetching your entries. Please try again.',
					'error',
					3
				)
			);
		}
	};
};

export const createEntry = (seed_artists, seed_genres, situation, emotion) => {
	return async (dispatch) => {
		try {
			const res = await entryService.createEntry({
				seed_artists,
				seed_genres,
				situation,
				emotion,
			});
			dispatch(appendEntry(res));
			dispatch(displayNotification('New entry created', 'success', 5));
			return res;
		} catch (err) {
			console.log(err);
			dispatch(
				displayNotification(
					'There was an error creating your entry. Please try again.',
					'error',
					5
				)
			);
		}
	};
};

export const updatePlaylist = (id, selectedTracks) => {
	return async (dispatch) => {
		try {
			const newEntry = await entryService.updatePlaylist(id, selectedTracks);
			dispatch(updateEntry(newEntry));
			dispatch(displayNotification('Playlist updated', 'success', 3));
		} catch (err) {
			dispatch(displayNotification('Error updating playlist', 'error', 3));
			console.error(err);
		}
	};
};

export const fetchEntryById = (id) => {
	return async (dispatch) => {
		try {
			const entry = await entryService.getEntry(id);
			if (entry.updated) {
				dispatch(updateEntry(entry));
				dispatch(
					displayNotification(
						'Entry has been updated since last fetch.',
						'success',
						3
					)
				);
			}
			return entry.entry;
		} catch (err) {
			console.error(err);
			dispatch(displayNotification('Error fetching entry', 'error', 3));
		}
	};
};

export const deleteEntry = (id) => {
	return async (dispatch) => {
		try {
			await entryService.deleteEntry(id);
			dispatch(removeEntry(id));
			dispatch(displayNotification('Entry deleted', 'success', 3));
		} catch (err) {
			dispatch(displayNotification('Error deleting entry', 'error', 3));
		}
	};
};

export const { updateEntry, appendEntry, setEntries, removeEntry } =
	entrySlice.actions;
export default entrySlice.reducer;
