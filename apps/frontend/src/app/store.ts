import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/authSlice";
import modelsReducer from "@features/modelManagment/modelsSlice"
import filesReducer from "@features/filesManagment/filesSlice"
import modelAdminReducer from "@/features/modelManagment/modelAdminSlice"
import categoriesReducer from "@/features/categories/categoriesSlice"



export const store = configureStore({
  reducer: { authReducer, modelsReducer, filesReducer, modelAdminReducer, categoriesReducer }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>