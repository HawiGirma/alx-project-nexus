import React from "react";
import { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  if (viewMode === "list") {
    return (
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="flex-shrink-0">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-32 h-32 object-cover rounded-l-lg"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>{product.stock} in stock</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  ${product.price}
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.rating})
                  </span>
                </div>
                <button className="btn btn-primary text-sm">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
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
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600 ml-1">
              ({product.rating})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{product.brand}</span>
          <span>{product.stock} in stock</span>
        </div>
        <button className="btn btn-primary w-full">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
