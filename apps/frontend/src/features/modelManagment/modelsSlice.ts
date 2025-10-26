import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AppState, ModelType } from "./types";
import type { RootState } from "@/app/store";

const initialState: AppState = {
  models: [],
  isLoading: false,
  isError: false,
  errorMessage: ""
}

const fetchModels = createAsyncThunk<ModelType[], void, { rejectValue: string }>(
  "models/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/models/full");

      if (!response.ok) {
        throw new Error("HTTP error!");
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
const fetchModel = createAsyncThunk<ModelType, string, { rejectValue: string }>(
  "models/fetchOne",
  async (modelName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/models/${modelName}/info`);

      if (!response.ok) {
        throw new Error("HTTP error!");
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
        throw new Error("HTTP error!");
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
const uploadFiles = createAsyncThunk<void, HTMLFormElement, { rejectValue: string }>(
  "models/uploadFiles",
  async (formFields: HTMLFormElement, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", formFields.fileObject);
      formData.append("type", "model");
      formData.append("modelName", formFields.modelName);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("HTTP error!");
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

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {},
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
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
  }
})

export const selectModels = (state: RootState) => state.modelsReducer.models;
export const selectModel = (state: RootState, name: string) => state.modelsReducer.models.find(model => model.name === name);

export default modelsSlice.reducer;