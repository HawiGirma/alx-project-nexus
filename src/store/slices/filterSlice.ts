import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../types";

const initialState: FilterState = {
  category: "",
  priceRange: {
    min: 0,
    max: 10000,
  },
  brand: "",
  rating: 0,
  searchQuery: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.priceRange = action.payload;
    },
    setBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload;
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.category = "";
      state.priceRange = { min: 0, max: 10000 };
      state.brand = "";
      state.rating = 0;
      state.searchQuery = "";
    },
    setAllFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setCategory,
  setPriceRange,
  setBrand,
  setRating,
  setSearchQuery,
  clearFilters,
  setAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
