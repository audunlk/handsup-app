
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/types";


const initialState: User = {
  id: null,
  email: null,
  first_name: null,
  last_name: null,
    username: null,
  password: null,

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.username = action.payload.username;
        state.password = action.payload.password;

    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.first_name = null;
      state.last_name = null;
        state.username = null;
        state.password = null;

    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

