import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../slices/userSlice';
import tokenSlice from '../slices/tokenSlice';
import loadingSlice from '../slices/loadingSlice';
import pollSlice from '../slices/pollSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        token: tokenSlice,
        polls: pollSlice,
        isLoading: loadingSlice,
    }
})

export default store;

