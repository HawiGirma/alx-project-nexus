import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginationState } from "../../types";

const initialState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 12,
  totalItems: 0,
  totalPages: 0,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
      state.totalPages = Math.ceil(action.payload / state.itemsPerPage);
    },
    nextPage: (state) => {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    resetPagination: (state) => {
      state.currentPage = 1;
    },
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  setTotalItems,
  nextPage,
  previousPage,
  resetPagination,
} = paginationSlice.actions;

export default paginationSlice.reducer;
