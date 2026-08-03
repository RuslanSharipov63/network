import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";



export const fetchUpdateProfile = createAsyncThunk(
  'name/fetchUpdateProfile',
  async (profileData: { id: number, username: string, address?: string, email: string }) => {
    const response = await fetch('http://localhost:5000/api/profile/update', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    })
    const data = await response.json();
    return data;
  }

)


export type UpdatableUserField = 'email' | 'username';

type InitialState = {
  success: boolean;
  message: string;
  status: "pending" | "fulfilled" | "rejected" | "Idle"
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
  status: "Idle",
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdateProfile.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchUpdateProfile.fulfilled, (state, action: PayloadAction<InitialState>) => {
        state.status = 'fulfilled';
        state.user = action.payload.user;
        state.message = action.payload.message
      })
      .addCase(fetchUpdateProfile.rejected, (state) => {
        state.status = "rejected"
        state.success = false
        state.message = "Ошибка обновления профиля. Попробуйте еще раз"
      })
  }

});

export const { authUser, logoutUser, updateAddress, updateDataUser } = auth.actions;
export default auth.reducer;
