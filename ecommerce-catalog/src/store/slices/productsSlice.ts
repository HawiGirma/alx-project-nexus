import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductsResponse, ApiError } from "../../types";
import { fetchProducts } from "../../services/api";

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  total: 0,
};

// Async thunk for fetching products
export const fetchProductsAsync = createAsyncThunk<
  ProductsResponse,
  { skip?: number; limit?: number; search?: string },
  { rejectValue: ApiError }
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await fetchProducts(params);
    return response;
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : "Failed to fetch products",
      status: 500,
    });
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilteredProducts: (state, action: PayloadAction<Product[]>) => {
      state.filteredItems = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      });
  },
});

export const { setFilteredProducts, clearError, updateProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
