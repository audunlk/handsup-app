import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReRenderState } from "../types/types";

const reRenderSlice = createSlice({
  name: "reRender",
  initialState: false,
  reducers: {
    triggerReRender: (state, action: PayloadAction<ReRenderState>) => action.payload,
  },
});

export const { triggerReRender } = reRenderSlice.actions;

export default reRenderSlice.reducer;
