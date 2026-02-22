import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FileTypes, type AppState, type FileDelete, type FileResponse, type ModelType, type SectionType } from "./types";
import type { RootState } from "@/app/store";
import { API_BASE } from "@/api/config";

const initialState: AppState = {
  models: [],
  files: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
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
export const fetchFiles = createAsyncThunk<FileResponse, SectionType, { rejectValue: string }>(
  "models/fetchFiles",
  async (type, { rejectWithValue }) => {
    try {
      const response = await fetch(type !== FileTypes.MODELS ? `${API_BASE}/api/models/${type}` : `${API_BASE}/api/models`);

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
      const response = await fetch(`${API_BASE}/api/files/${obj.type}/${obj.fileName}`, {
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
export const downloadDefaultMarker = createAsyncThunk<void, void, { rejectValue: string }>(
  "models/defaultMarker",
  async (_, { rejectWithValue }) => {
    fetch(`${API_BASE}/api/files/patterns/default`).then(response => {
      if (!response.ok) throw new Error('Failed to download');
      return response.blob();
    })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'default-marker.patt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }).catch(err => {
        if (err instanceof Error) {
          return rejectWithValue(err.message);
        } else {
          return rejectWithValue("Unknown error!");
        }
      })
  }
)
export const uploadFiles = createAsyncThunk<void, FormData, { rejectValue: string }>(
  "models/uploadFiles",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/files/upload`, {
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
      .addCase(fetchCurrentModel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentModel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentModel = action.payload;
      })
      .addCase(fetchCurrentModel.rejected, (state, action) => {
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
      .addCase(uploadFiles.fulfilled, (state) => {
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

export const { resetUploadState } = actions;

export const selectModels = (state: RootState) => state.modelsReducer.models;
export const selectModel = (state: RootState, name: string) => state.modelsReducer.models.find(model => model.name === name);

export default reducer;