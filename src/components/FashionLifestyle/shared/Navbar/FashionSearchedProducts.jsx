"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import FashionSection from "../FashionSection";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../Card/FashionProductCard";
import { useCategoryItem } from "../../hooks/fetchData/useCategoryItem";
import ProductCardSkeleton from "../SkeletonLoading/ProductCardSkeleton";
import NoItemFound from "@/components/common/NoItemFound";

const FashionSearchedProducts = () => {
  const { useSearchedProductsByType } = useCategoryItem();

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");
  const typeId = searchParams.get("type_id");

  const {
    data: productInfo,
    isLoading,
    isError,
  } = useSearchedProductsByType(typeId, searchText);

  if (isLoading)
    return (
      <FashionSection className="min-h-content">
        <div className="h-6 md:h-7 mb-4 md:mb-6 rounded-md bg-gray-200 animate-pulse w-1/2 lg:w-1/4" />
        <div className={PRODUCT_GRID_CLASS}>
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </FashionSection>
    );

  if (isError) {
    return (
      <FashionSection className="min-h-content">
        <div className="text-center text-red-500 py-10">
          Failed to load searched products!
        </div>
      </FashionSection>
    );
  }

  if (!productInfo || productInfo?.length === 0) {
    return <NoItemFound />;
  }

  return (
    <FashionSection className="min-h-content">
      <h1 className="text-base md:text-xl font-medium text-gray-500 mb-4 md:mb-6">
        {productInfo.length} items found for{" "}
        <span className="text-gray-800">&ldquo;{searchText}&rdquo;</span>
      </h1>

      <div className={PRODUCT_GRID_CLASS}>
        {productInfo.map((product) => (
          <FashionProductCard
            key={product?._id?.toString()}
            product={product}
          />
        ))}
      </div>
    </FashionSection>
  );
};

export default FashionSearchedProducts;
