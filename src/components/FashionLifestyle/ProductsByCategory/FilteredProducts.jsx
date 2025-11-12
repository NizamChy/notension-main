import React from "react";
import ProductCard from "./ProductCard";

const FilteredProducts = ({
  products,
  filteredProducts,
  loading,
  clearAllFilters,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts?.length} of {products?.length} products
        </p>
        <div>
          <label htmlFor="sort" className="mr-2 text-sm">
            Sort by:
          </label>
          <select
            value={sortOption}
            onChange={onSortChange}
            id="sort"
            className="border rounded p-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredProducts?.length === 0 ? (
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
          {filteredProducts?.map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilteredProducts;
