import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE } from "@/app/api/config";
import { fetchWithAuth } from "@/shared/utils/fetchWithAuth";
import type { ModelType } from "./modelTypes";

export interface AdminModelState {
  models: ModelType[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: AdminModelState = {
  models: [],
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchModelsAdmin = createAsyncThunk(
  "adminModels/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/models`);
      if (!response.ok) throw new Error("Failed to fetch models");
      const data = await response.json();
      return data as ModelType[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createModel = createAsyncThunk(
  "adminModels/create",
  async (modelData: Partial<ModelType>, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/models`, {
        method: "POST",
        body: JSON.stringify(modelData),
      });
      if (!response.ok) throw new Error("Failed to create model");
      const data = await response.json();
      return data as ModelType;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateModel = createAsyncThunk(
  "adminModels/update",
  async (payload: { id: number; data: Partial<ModelType> }, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/models/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify(payload.data),
      });
      if (!response.ok) throw new Error("Failed to update model");
      const data = await response.json();
      return data as ModelType;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteModel = createAsyncThunk(
  "adminModels/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/admin/models/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete model");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const assignCategories = createAsyncThunk(
  "adminModels/assignCategories",
  async ({ modelName, categoryIds }: { modelName: string; categoryIds: number[] }) => {
    await fetchWithAuth(`${API_BASE}/api/models/${modelName}/categories`, {
      method: "POST",
      body: JSON.stringify(categoryIds),
    });
  }
);

const adminModelSlice = createSlice({
  name: "adminModels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelsAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchModelsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
      })
      .addCase(fetchModelsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(createModel.fulfilled, (state, action) => {
        state.models.push(action.payload);
      })
      .addCase(updateModel.fulfilled, (state, action) => {
        const index = state.models.findIndex(m => m.id === action.payload.id);
        if (index !== -1) state.models[index] = action.payload;
      })
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.models = state.models.filter(m => m.id !== action.payload);
      });
  },
});

export default adminModelSlice.reducer;