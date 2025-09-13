import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import filterReducer from "./slices/filterSlice";
import sortReducer from "./slices/sortSlice";
import paginationReducer from "./slices/paginationSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filter: filterReducer,
    sort: sortReducer,
    pagination: paginationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
