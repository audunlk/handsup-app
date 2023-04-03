import { configureStore } from '@reduxjs/toolkit';
import userSlice from '../slices/userSlice';
import tokenSlice from '../slices/tokenSlice';
import loadingSlice from '../slices/loadingSlice';
import pollSlice from '../slices/pollSlice';
import loggedInSlice from '../slices/loggedInSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        token: tokenSlice,
        polls: pollSlice,
        isLoading: loadingSlice,
        isLoggedIn: loggedInSlice
    }
})

export default store;

