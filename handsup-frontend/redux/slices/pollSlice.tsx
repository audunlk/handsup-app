import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll } from '../types/types';


const initialState: Poll[] = [];


const pollSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {
        setPolls: (state, action: PayloadAction<Poll[]>) => action.payload,
    }
});

export const { setPolls } = pollSlice.actions;

export default pollSlice.reducer;
