import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  type ModelState,
  type ModelType,
} from "./modelTypes";
import { API_BASE } from "@/app/api/config";

const initialState: ModelState = {
  models: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
  currentModel: null
}

export const fetchModels = createAsyncThunk<ModelType[], void, { rejectValue: string }>(
  "models/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/models/full`);

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data) {
        return data;
      } else {
        throw new Error("Models not found!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
      }
    }
  }
)
export const fetchCurrentModel = createAsyncThunk<ModelType, string, { rejectValue: string }>(
  "models/fetchOne",
  async (modelName: string | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/models/${modelName}/info`);

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data) {
        return data;
      } else {
        throw new Error("Model not found!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
      }
    }
  }
)
export const fetchModelsByCategory = createAsyncThunk(
  "models/fetchByCategory",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/models/categories/${categoryId}/full`);
      if (!response.ok) throw new Error("Failed to fetch");
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
      })
      .addCase(fetchModelsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
      })
      .addCase(fetchCurrentModel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentModel = action.payload;
      })
      .addMatcher(isAnyOf(
        fetchModels.pending,
        fetchCurrentModel.pending,
        fetchModelsByCategory.pending), (state) => {
          state.isLoading = true;
          state.isError = false;
        })
      .addMatcher(isAnyOf(
        fetchModels.rejected,
        fetchCurrentModel.rejected,
        fetchModelsByCategory.rejected), (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.errorMessage = action.payload;
        })
  }
})


export default modelsSlice.reducer;