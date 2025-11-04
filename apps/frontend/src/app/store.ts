import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/authSlice";
import modelsReducer from "@features/modelManagment/modelsSlice"


export const store = configureStore({
  reducer: { authReducer, modelsReducer }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>