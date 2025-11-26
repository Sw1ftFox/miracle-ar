import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AppState, ModelType } from "./types";
import type { RootState } from "@/app/store";

const initialState: AppState = {
  models: [],
  currentModel: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: ""
}

export const fetchModels = createAsyncThunk<ModelType[], void, { rejectValue: string }>(
  "models/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/models/full");

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
        rejectWithValue(err.message);
      } else {
        rejectWithValue("Unknown error!");
      }
    }
  }
)
export const fetchModel = createAsyncThunk<ModelType, string, { rejectValue: string }>(
  "models/fetchOne",
  async (modelName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/models/${modelName}/info`);

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
        rejectWithValue(err.message);
      } else {
        rejectWithValue("Unknown error!");
      }
    }
  }
)
const deleteModel = createAsyncThunk<string | undefined, string, { rejectValue: string }>(
  "models/delete",
  async (modelName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/models/${modelName}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }

      return modelName;
    } catch (err: unknown) {
      if (err instanceof Error) {
        rejectWithValue(err.message);
      } else {
        rejectWithValue("Unknown error!");
      }
    }
  }
)
export const uploadFiles = createAsyncThunk<void, FormData, { rejectValue: string }>(
  "models/uploadFiles",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (err: unknown) {
      if (err instanceof Error) {
        rejectWithValue(err.message);
      } else {
        rejectWithValue("Unknown error!");
      }
    }
  }
)

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
    setCurrentModel: (state, action) => {
      state.currentModel = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchModel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchModel.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchModel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteModel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = state.models.filter(model => model.name !== action.payload)
      })
      .addCase(deleteModel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(uploadFiles.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
  }
})

const { actions, reducer } = modelsSlice;

export const { resetUploadState, setCurrentModel } = actions;

export const selectModels = (state: RootState) => state.modelsReducer.models;
export const selectModel = (state: RootState, name: string) => state.modelsReducer.models.find(model => model.name === name);

export default reducer;