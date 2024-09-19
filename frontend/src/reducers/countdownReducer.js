import { createSlice } from '@reduxjs/toolkit';

const countdownSlice = createSlice({
	name: 'countdown',
	initialState: { isCountdownVisible: false },
	reducers: {
		setCountdownDisplay: (state, action) => {
			state.isCountdownVisible = action.payload;
		},
	},
});

export const { setCountdownDisplay } = countdownSlice.actions;
export default countdownSlice.reducer;
