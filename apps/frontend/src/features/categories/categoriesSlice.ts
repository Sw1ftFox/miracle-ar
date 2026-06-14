import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE } from "@/app/api/config";
import { fetchWithAuth } from "@/shared/utils/fetchWithAuth";

export interface CategoryType {
  id: number;
  name: string;
  description?: string;
}

export interface CategoriesState {
  categories: CategoryType[];
  isLoading: boolean;
}

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const res = await fetch(`${API_BASE}/api/categories`);
    return res.json() as Promise<CategoryType[]>;
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (data: { name: string; description?: string }) => {
    const res = await fetchWithAuth(`${API_BASE}/api/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.json() as Promise<CategoryType>;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { categories: [] as CategoryType[], isLoading: false } as CategoriesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
  },
});

export default categoriesSlice.reducer;