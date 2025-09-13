import React from "react";
import { useProducts } from "./hooks/useProducts";
import { Product } from "./types";

function App() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              E-Commerce Catalog
            </h1>
            <div className="text-sm text-gray-500">
              {products.length} products found
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-primary-600">
                    ${product.price}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{product.brand}</span>
                  <span>{product.stock} in stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
