"use client";

import ProductCards from "./ProductCards";
import React, { useState, useMemo } from "react";
import { HiChevronDown } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { EmptyState, PRIMARY_BUTTON } from "@/components/shared/UI/UI";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const LISTING_GRID_CLASS =
  "grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8 xl:grid-cols-4";

const FilterProducts = ({
  isError,
  products = [],
  isLoading,
  clearAllFilters,
  totalCount,
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
      <div className="min-w-0 flex-1">
        <EmptyState
          title="Couldn't load products"
          text="Please check your connection and try again."
        />
      </div>
    );

  return (
    <div className="w-full min-w-0 flex-1">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 md:mb-6">
        <p className="text-sm text-gray-500" aria-live="polite">
          {isLoading ? (
            "Loading products…"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold tabular-nums text-gray-900">
                {sortedProducts?.length}
              </span>{" "}
              of{" "}
              <span className="tabular-nums">
                {totalCount ?? products?.length}
              </span>{" "}
              products
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="hidden text-sm text-gray-500 sm:block">
            Sort by
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              aria-label="Sort products"
              className="h-10 appearance-none rounded-full border border-gray-200 bg-white pl-4 pr-9 text-sm font-medium text-gray-800 outline-none transition-colors hover:border-gray-300 focus:border-[#0C3F8E] focus:ring-2 focus:ring-[#0C3F8E]/15"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
            <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={LISTING_GRID_CLASS}>
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <EmptyState
          icon={<HiOutlineShoppingBag />}
          title="No products found"
          text="Try adjusting your filters or search for something else."
          action={
            <button
              type="button"
              onClick={clearAllFilters}
              className={PRIMARY_BUTTON}
            >
              Clear all filters
            </button>
          }
        />
      ) : (
        <div className={LISTING_GRID_CLASS}>
          {sortedProducts.map((product) => (
            <ProductCards key={product?._id?.toString()} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterProducts;
