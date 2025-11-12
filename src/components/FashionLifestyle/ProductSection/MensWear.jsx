"use client";

import React, { useState } from "react";
import Title from "../CategorySection/Title";
import { MEN_TYPE_ID } from "../utils/constant";
import PopularProductCard from "./PopularProductCard";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const MensWear = () => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(8);

  const { usePopularProductsByType } = useCategoryItem();

  const {
    data: productInfo,
    isLoading,
    isError,
  } = usePopularProductsByType(MEN_TYPE_ID);

  const handleViewMore = () => {
    setVisibleProductsCount((prevCount) => prevCount + 8);
  };

  const handleViewLess = () => {
    setVisibleProductsCount(8);
  };

  if (isLoading)
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-8 lg:min-h-10 mb-3 rounded-md bg-gray-200 animate-pulse w-1/3 lg:w-1/4" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );

  if (isError) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title title="Men's Wear" />
          <div className="text-center text-red-500 py-10">
            Failed to load mens products
          </div>
        </div>
      </section>
    );
  }

  if (!productInfo || productInfo?.length === 0) {
    return null;
  }

  const reversedProducts = [...productInfo]?.reverse();
  const displayedProducts = reversedProducts?.slice(0, visibleProductsCount);
  const hasMoreProducts = reversedProducts?.length > visibleProductsCount;

  return (
    <section className="py-4 lg:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Title title="Men's Wear" />

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts?.map((product) => (
            <PopularProductCard
              key={product?._id?.toString()}
              product={product}
            />
          ))}
        </div>

        {reversedProducts?.length > 8 && (
          <div className="mt-12 text-center">
            {hasMoreProducts ? (
              <button
                onClick={handleViewMore}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                View More Products
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleViewLess}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                View Less Products
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MensWear;
