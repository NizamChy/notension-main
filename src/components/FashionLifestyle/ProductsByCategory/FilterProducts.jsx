"use client";

import ProductCards from "./ProductCards";
import React, { useState, useMemo } from "react";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const FilterProducts = ({
  isError,
  products = [],
  isLoading,
  clearAllFilters,
}) => {
  const [sortOption, setSortOption] = useState("featured");

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedProducts = useMemo(() => {
    if (!products) return [];

    const sorted = [...products];

    switch (sortOption) {
      case "price-low":
        return sorted.sort(
          (a, b) =>
            (a.sale_price || a.max_retail_price) -
            (b.sale_price || b.max_retail_price)
        );

      case "price-high":
        return sorted.sort(
          (a, b) =>
            (b.sale_price || b.max_retail_price) -
            (a.sale_price || a.max_retail_price)
        );

      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      default:
        return sorted;
    }
  }, [products, sortOption]);

  if (isError)
    return (
      <div className="text-red-500 text-center">Error loading products!</div>
    );

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {sortedProducts?.length} of {products?.length} products
        </p>

        <div>
          <label htmlFor="sort" className="mr-2 text-sm">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border rounded p-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search for something else
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {sortedProducts.map((product) => (
            <ProductCards key={product?._id?.toString()} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterProducts;
