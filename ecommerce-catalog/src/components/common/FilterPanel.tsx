import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setCategory,
  setBrand,
  setPriceRange,
  setRating,
  clearFilters,
} from "../../store/slices/filterSlice";
import { useProducts } from "../../hooks/useProducts";

const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.filter);
  const { categories, brands, priceRange } = useProducts();

  const handlePriceRangeChange = (type: "min" | "max", value: number) => {
    const newRange = {
      ...filter.priceRange,
      [type]: value,
    };
    dispatch(setPriceRange(newRange));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setRating(rating));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => dispatch(clearFilters())}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Category
        </label>
        <select
          value={filter.category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          className="select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Brand
        </label>
        <select
          value={filter.brand}
          onChange={(e) => dispatch(setBrand(e.target.value))}
          className="select"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filter.priceRange.min || ""}
              onChange={(e) =>
                handlePriceRangeChange("min", Number(e.target.value))
              }
              className="input flex-1"
              min={priceRange.min}
              max={priceRange.max}
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={filter.priceRange.max || ""}
              onChange={(e) =>
                handlePriceRangeChange("max", Number(e.target.value))
              }
              className="input flex-1"
              min={priceRange.min}
              max={priceRange.max}
            />
          </div>
          <div className="text-xs text-gray-500">
            Range: ${priceRange.min} - ${priceRange.max}
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Minimum Rating
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                filter.rating === rating
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium">{rating}+</span>
            </button>
          ))}
        </div>
        {filter.rating > 0 && (
          <button
            onClick={() => dispatch(setRating(0))}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Clear rating filter
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
