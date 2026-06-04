import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    avatarUrl: string;
    address?: string;
    role: string;
  };
};

const initialState: InitialState = {
  success: false,
  message: "",
  user: {
    id: 0,
    email: "",
    username: "",
    avatarUrl: "",
    address: "",
    role: "",
  },
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<InitialState>) => {

      state.success = action.payload.success;
      state.message = action.payload.message;
      state.user = action.payload.user;
    },
    logoutUser: (state) => {
      state.user = {
        id: 0,
        email: "",
        username: "",
        avatarUrl: "",
        role: "",
      };
    },
  },
});

export const { authUser, logoutUser } = auth.actions;
export default auth.reducer;
