import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll } from '../types/types';

const initialState: Poll[] = [];

const pollSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {
        setPolls: (state, action: PayloadAction<Poll[]>) => action.payload,
        clearPolls: (state) => {
            state.splice(0, state.length);
        },
    },
});

export const { setPolls, clearPolls } = pollSlice.actions;

export default pollSlice.reducer;
