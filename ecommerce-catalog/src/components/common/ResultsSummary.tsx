import React from "react";
import { useProducts } from "../../hooks/useProducts";

const ResultsSummary: React.FC = () => {
  const { filteredProducts, allProducts } = useProducts();

  const totalProducts = allProducts.length;
  const filteredCount = filteredProducts.length;
  const isFiltered = filteredCount < totalProducts;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-gray-600">
        {isFiltered ? (
          <>
            Showing{" "}
            <span className="font-semibold text-gray-900">{filteredCount}</span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{totalProducts}</span>{" "}
            products
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-900">{totalProducts}</span>{" "}
            products found
          </>
        )}
      </div>
      {isFiltered && (
        <div className="text-xs text-gray-500">Filters applied</div>
      )}
    </div>
  );
};

export default ResultsSummary;
