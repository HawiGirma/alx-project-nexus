import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  fetchProductsAsync,
  setFilteredProducts,
} from "../store/slices/productsSlice";
import { filterProducts, sortProducts } from "../utils/filterUtils";

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { items, filteredItems, loading, error, total } = useAppSelector(
    (state) => state.products
  );
  const filter = useAppSelector((state) => state.filter);
  const sort = useAppSelector((state) => state.sort);
  const pagination = useAppSelector((state) => state.pagination);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProductsAsync({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Apply filters and sorting whenever products, filters, or sort changes
  useEffect(() => {
    if (items.length > 0) {
      const filtered = filterProducts(items, filter);
      const sorted = sortProducts(filtered, sort);
      dispatch(setFilteredProducts(sorted));
    }
  }, [items, filter, sort, dispatch]);

  // Get paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, pagination.currentPage, pagination.itemsPerPage]);

  // Get unique categories and brands for filters
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(items.map((product) => product.category))
    );
    return uniqueCategories.sort();
  }, [items]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(
      new Set(items.map((product) => product.brand))
    );
    return uniqueBrands.sort();
  }, [items]);

  // Get price range for price filter
  const priceRange = useMemo(() => {
    if (items.length === 0) return { min: 0, max: 1000 };
    const prices = items.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [items]);

  return {
    products: paginatedProducts,
    allProducts: items,
    filteredProducts: filteredItems,
    loading,
    error,
    total,
    categories,
    brands,
    priceRange,
    pagination,
  };
};
