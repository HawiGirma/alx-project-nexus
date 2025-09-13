// Product related types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// API response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Filter and sort types
export interface FilterState {
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  brand: string;
  rating: number;
  searchQuery: string;
}

export interface SortState {
  field: "price" | "title" | "rating" | "stock";
  direction: "asc" | "desc";
}

// Pagination types
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// UI state types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  showFilters: boolean;
}

// Root state type
export interface RootState {
  products: Product[];
  filteredProducts: Product[];
  filter: FilterState;
  sort: SortState;
  pagination: PaginationState;
  ui: UIState;
}

// API error type
export interface ApiError {
  message: string;
  status?: number;
}
