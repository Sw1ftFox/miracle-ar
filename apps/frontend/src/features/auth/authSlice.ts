import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthType } from "./authTypes";
import type { RootState } from "@/app/store";
import { API_BASE } from "@/app/api/config";
import { StorageService } from "@/shared/utils/StorageService";

const initialState: AuthType = {
  isAuth: !!StorageService.getItem('authToken'),
  isLoading: false,
  isError: false,
  errorMessage: '',
  token: StorageService.getItem('authToken') || null,
  role: StorageService.getItem('userRole') || null,
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

export const loginWithJWT = createAsyncThunk<
  { token: string; email: string; role: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginWithJWT', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.text();
      return rejectWithValue(error);
    }
    const data = await response.json();
    return data;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    return rejectWithValue('Network error');
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      StorageService.clear();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithJWT.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(loginWithJWT.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.role = action.payload.role;
        StorageService.saveItem('authToken', action.payload.token);
        StorageService.saveItem('userRole', action.payload.role);
      })
      .addCase(loginWithJWT.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
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