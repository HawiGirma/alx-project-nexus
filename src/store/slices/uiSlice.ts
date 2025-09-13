import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UIState } from "../../types";

const initialState: UIState = {
  isLoading: false,
  error: null,
  viewMode: "grid",
  showFilters: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === "grid" ? "list" : "grid";
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setViewMode,
  toggleViewMode,
  setShowFilters,
  toggleFilters,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;
