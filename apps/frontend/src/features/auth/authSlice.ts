import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthType } from "./authTypes";
import type { RootState } from "@/app/store";
import { API_BASE } from "@/app/api/config";
import { StorageService } from "@/shared/utils/StorageService";

const initialState: AuthType = {
  isAuth: StorageService.getItem("isAuth"),
  isLoading: false,
  isError: false,
  errorMessage: "",
}

export const loginAdmin = createAsyncThunk<boolean, string, { rejectValue: string }>(
  'auth/login',
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/authenticate`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json();

      if (data.authenticated) {
        return true;
      } else {
        return rejectWithValue("Неверный пароль!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Неизвестная ошибка!");
      }
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      StorageService.removeItem("isAuth");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuth = true;
        StorageService.saveItem("isAuth", true)
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

export const { logout } = authSlice.actions;

export default authSlice.reducer;