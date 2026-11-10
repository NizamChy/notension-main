"use client";

import React, { useState } from "react";
import Title from "../CategorySection/Title";
import FashionSection from "../shared/FashionSection";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../shared/Card/FashionProductCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const PAGE_SIZE = 8;

const Chevron = ({ up }) => (
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
      d={up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
    />
  </svg>
);

/** Popular products of one fashion type (Men / Women / Kids) with View More. */
const PopularTypeSection = ({ typeId, title, errorText }) => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(PAGE_SIZE);

  const { usePopularProductsByType } = useCategoryItem();
  const { data: productInfo, isLoading, isError } =
    usePopularProductsByType(typeId);

  if (isLoading)
    return (
      <FashionSection>
        <div className="h-8 lg:h-9 mb-4 md:mb-6 rounded-md bg-gray-200 animate-pulse w-1/3 lg:w-1/4" />
        <div className={PRODUCT_GRID_CLASS}>
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </FashionSection>
    );

  if (isError) {
    return (
      <FashionSection>
        <Title title={title} />
        <div className="text-center text-red-500 py-10">{errorText}</div>
      </FashionSection>
    );
  }

  if (!productInfo || productInfo?.length === 0) return null;

  const reversedProducts = [...productInfo].reverse();
  const displayedProducts = reversedProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = reversedProducts.length > visibleProductsCount;

  return (
    <FashionSection>
      <Title title={title} />

      <div className={PRODUCT_GRID_CLASS}>
        {displayedProducts.map((product) => (
          <FashionProductCard
            key={product?._id?.toString()}
            product={product}
          />
        ))}
      </div>

      {reversedProducts.length > PAGE_SIZE && (
        <div className="mt-8 md:mt-10 text-center">
          <button
            onClick={() =>
              hasMoreProducts
                ? setVisibleProductsCount((c) => c + PAGE_SIZE)
                : setVisibleProductsCount(PAGE_SIZE)
            }
            className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-sm md:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            {hasMoreProducts ? "View More Products" : "View Less Products"}
            <Chevron up={!hasMoreProducts} />
          </button>
        </div>
      )}
    </FashionSection>
  );
};

export default PopularTypeSection;
