import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { authType } from "./types";
import type { RootState } from "@/app/store";

const initialState: authType = {
  isAuth: false,
  isLoading: false,
  isError: false,
  errorMessage: "",
}

export const loginAdmin = createAsyncThunk<void, string, { rejectValue: string }>(
  'auth/login',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/authenticate", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        throw new Error("HTTP error!");
      }

      const data = await response.json();

      if (!data.authenticated) {
        throw new Error("Password incorrect!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        rejectWithValue(err.message);
      } else {
        rejectWithValue("Unknown error!");
      }
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;

      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
  }
});

export const selectAuth = (state: RootState) => state.authReducer.isAuth;
export const selectUserLoading = (state: RootState) => state.authReducer.isLoading;
export const selectAuthError = (state: RootState) => state.authReducer.isError;
export const selectAuthErrorMessage = (state: RootState) => state.authReducer.errorMessage;

export default authSlice.reducer;