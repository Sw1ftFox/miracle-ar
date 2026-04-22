import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/authSlice";
import modelsReducer from "@features/modelManagment/modelsSlice"
import filesReducer from "@features/filesManagment/filesSlice"


export const store = configureStore({
  reducer: { authReducer, modelsReducer, filesReducer }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>