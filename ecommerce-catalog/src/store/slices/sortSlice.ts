import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SortState } from "../../types";

const initialState: SortState = {
  field: "title",
  direction: "asc",
};

const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortField: (state, action: PayloadAction<SortState["field"]>) => {
      state.field = action.payload;
    },
    setSortDirection: (
      state,
      action: PayloadAction<SortState["direction"]>
    ) => {
      state.direction = action.payload;
    },
    setSort: (state, action: PayloadAction<SortState>) => {
      state.field = action.payload.field;
      state.direction = action.payload.direction;
    },
    toggleSortDirection: (state) => {
      state.direction = state.direction === "asc" ? "desc" : "asc";
    },
  },
});

export const { setSortField, setSortDirection, setSort, toggleSortDirection } =
  sortSlice.actions;

export default sortSlice.reducer;
