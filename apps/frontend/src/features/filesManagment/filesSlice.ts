import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  FileTypes,
  type FileResponse,
  type FilesState,
  type FileType,
  type SectionType
} from "./fileTypes";
import { API_BASE } from "@/app/api/config";
import { fetchWithAuth } from "@/shared/utils/fetchWithAuth";

const initialState: FilesState = {
  files: [],
  isSuccess: false,
  isLoading: false,
  isError: false,
  errorMessage: "",
}

export const fetchFiles = createAsyncThunk<FileResponse, SectionType, { rejectValue: string }>(
  "files/fetchFiles",
  async (type, { rejectWithValue }) => {
    try {
      const response = await fetch(
        type !== FileTypes.MODELS
          ? `${API_BASE}/api/models/${type}`
          : `${API_BASE}/api/models`
      );

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
export const downloadFile = createAsyncThunk<void, FileType, { rejectValue: string }>(
  "files/downloadFile",
  async (obj, { rejectWithValue }) => {
    fetch(`${API_BASE}/api/files/${obj.type}/${obj.fileName}`).then(response => {
      if (!response.ok) throw new Error('Failed to download');
      return response.blob();
    })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = obj.fileName;
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
export const deleteFile = createAsyncThunk<string | undefined, FileType, { rejectValue: string }>(
  "files/delete",
  async (obj, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/files/${obj.type}/${obj.fileName}`, {
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
  "files/defaultMarker",
  async (_, { rejectWithValue }) => {
    fetchWithAuth(`${API_BASE}/api/files/patterns/default`).then(response => {
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
  "files/uploadFiles",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(`${API_BASE}/api/files/upload`, {
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

const filesSlice = createSlice({
  name: "files",
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
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload.data;
      })
      .addCase(downloadFile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = state.files.filter(file => file !== action.payload)
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addMatcher(isAnyOf(
        fetchFiles.pending,
        downloadFile.pending,
        deleteFile.pending,
        uploadFiles.pending), (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addMatcher(isAnyOf(
        fetchFiles.rejected,
        downloadFile.rejected,
        deleteFile.rejected,
        uploadFiles.rejected), (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
  }
})

const { actions, reducer } = filesSlice;

export const { resetUploadState } = actions;

export default reducer;