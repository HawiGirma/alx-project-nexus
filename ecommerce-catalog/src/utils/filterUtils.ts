import { Product, FilterState, SortState } from "../types";

export const filterProducts = (
  products: Product[],
  filters: FilterState
): Product[] => {
  return products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (
      product.price < filters.priceRange.min ||
      product.price > filters.priceRange.max
    ) {
      return false;
    }

    // Brand filter
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(query);
      const matchesDescription = product.description
        .toLowerCase()
        .includes(query);
      const matchesBrand = product.brand.toLowerCase().includes(query);

      if (!matchesTitle && !matchesDescription && !matchesBrand) {
        return false;
      }
    }

    return true;
  });
};

export const sortProducts = (
  products: Product[],
  sort: SortState
): Product[] => {
  return [...products].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sort.field) {
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "rating":
        aValue = a.rating;
        bValue = b.rating;
        break;
      case "stock":
        aValue = a.stock;
        bValue = b.stock;
        break;
      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (sort.direction === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const getPriceRange = (
  products: Product[]
): { min: number; max: number } => {
  if (products.length === 0) {
    return { min: 0, max: 1000 };
  }

  const prices = products.map((product) => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );
  return categories.sort();
};

export const getUniqueBrands = (products: Product[]): string[] => {
  const brands = Array.from(new Set(products.map((product) => product.brand)));
  return brands.sort();
};
