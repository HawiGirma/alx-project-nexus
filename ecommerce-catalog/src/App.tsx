import React from "react";
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import { setShowFilters } from "./store/slices/uiSlice";
import SearchBar from "./components/common/SearchBar";
import SortDropdown from "./components/common/SortDropdown";
import FilterPanel from "./components/common/FilterPanel";
import FilterToggle from "./components/common/FilterToggle";
import ViewToggle from "./components/common/ViewToggle";
import ResultsSummary from "./components/common/ResultsSummary";
import ProductGrid from "./components/product/ProductGrid";

function App() {
  const dispatch = useAppDispatch();
  const showFilters = useAppSelector((state) => state.ui.showFilters);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              E-Commerce Catalog
            </h1>
            <div className="flex items-center space-x-4">
              <SearchBar />
              <ViewToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => dispatch(setShowFilters(false))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <FilterPanel />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <FilterToggle />
                <SortDropdown />
              </div>
              <ResultsSummary />
            </div>

            <ProductGrid />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
