
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";


const initialState: User = {
  id: null,
  email: null,
  firstName: null,
  lastName: null,
  username: null,
  expoPushToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.expoPushToken = action.payload.expoPushToken;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.username = null;
      state.expoPushToken = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

