import { createSlice } from '@reduxjs/toolkit';

const countdownSlice = createSlice({
	name: 'countdown',
	initialState: { isVisible: false },
	reducers: {
		setCountdownDisplay: (state, action) => {
			state.isVisible = action.payload;
		},
	},
});

export const { setCountdownDisplay } = countdownSlice.actions;
export default countdownSlice.reducer;
