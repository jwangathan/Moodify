import { createSlice } from '@reduxjs/toolkit';
import chatService from '../services/chats';

const chatSlice = createSlice({
	name: 'chats',
	initialState: [],
	reducers: {
		appendChat(state, action) {
			state.push(action.payload);
		},
		setChats(state, action) {
			return action.payload;
		},
	},
});

export const initializeChats = () => {
	return async (dispatch) => {
		const chats = await chatService.getAll();
		dispatch(setChats(chats));
	};
};

export const createChat = (
	artists,
	genres,
	tracks,
	spotifyId,
	situation,
	emotion,
	token
) => {
	return async (dispatch) => {
		chatService.create({
			artists,
			genres,
			tracks,
			spotifyId,
			situation,
			emotion,
			token,
		});
	};
};

export const { appendChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;
