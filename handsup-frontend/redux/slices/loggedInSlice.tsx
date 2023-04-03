import { createSlice } from "@reduxjs/toolkit";

const loggedInSlice = createSlice({
    name: "loggedIn",
    initialState: false,
    reducers: {
        setIsLoggedIn: (state, action) => action.payload,
    },
});

export const { setIsLoggedIn } = loggedInSlice.actions;

export default loggedInSlice.reducer;