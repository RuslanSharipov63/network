import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export type UpdatableUserField = 'email' | 'username';

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
    updateAddress: (state, action: PayloadAction<string>) => {
      let arr = { ...state }
      arr.user.address = action.payload;
      state = arr;
    },
    updateDataUser: (state, action: PayloadAction<{ valuename: UpdatableUserField, param: string }>) => {
      let arr = { ...state }
        arr.user[action.payload.valuename] = action.payload.param
        state = arr;
    }
    },
  });

export const { authUser, logoutUser, updateAddress, updateDataUser } = auth.actions;
export default auth.reducer;
