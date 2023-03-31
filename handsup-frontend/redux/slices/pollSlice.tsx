import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll } from '../types/types';

interface PollState {
    polls: Poll[];
}

const initialState: PollState = {
    polls: [],
};

const pollSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {
        setPolls: (state, action: PayloadAction<Poll[]>) => {
            state.polls = action.payload;
        }
    }
});

export const { setPolls } = pollSlice.actions;

export default pollSlice.reducer;
