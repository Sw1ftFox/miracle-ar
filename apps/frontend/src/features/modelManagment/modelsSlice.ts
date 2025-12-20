import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FileTypes, type AppState, type FileDelete, type FileResponse, type ModelType, type SectionType } from "./types";
import type { RootState } from "@/app/store";

const initialState: AppState = {
  models: [],
  files: [],
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
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
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
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
      }
    }
  }
)
export const fetchFiles = createAsyncThunk<FileResponse, SectionType, { rejectValue: string }>(
  "models/fetchFiles",
  async (type, { rejectWithValue }) => {
    try {
      const response = await fetch(type !== FileTypes.MODELS ? `/api/models/${type}` : `/api/models`);

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return { type, data };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
      }
    }
  }
)
export const deleteFile = createAsyncThunk<string | undefined, FileDelete, { rejectValue: string }>(
  "models/delete",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/files/${obj.type}/${obj.fileName}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(`HTTP ${response.status}: ${errorText}`);
      }

      return obj.fileName;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
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
        return rejectWithValue(err.message);
      } else {
        return rejectWithValue("Unknown error!");
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
      .addCase(fetchFiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload.data;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file !== action.payload)
      })
      .addCase(deleteFile.rejected, (state, action) => {
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