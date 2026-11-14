"use client";

import React, { useState } from "react";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import Title from "../CategorySection/Title";
import FashionSection from "../shared/FashionSection";
import { Skeleton } from "@/components/shared/UI/UI";
import { ShowMoreButton } from "../ProductSection/PopularTypeSection";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../shared/Card/FashionProductCard";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const PAGE_SIZE = 8;

const StoreProducts = ({ title, productInfo, isLoading }) => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(PAGE_SIZE);

  const params = useParams();

  if (isLoading)
    return (
      <FashionSection>
        <Skeleton className="mb-6 h-7 w-1/2 !rounded-full sm:w-1/3 lg:w-1/4" />
        <div className={PRODUCT_GRID_CLASS}>
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </FashionSection>
    );

  if (!productInfo || productInfo?.length === 0) {
    return null;
  }

  const reversedProducts = [...productInfo].reverse();
  const displayedProducts = reversedProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = reversedProducts.length > visibleProductsCount;

  return (
    <FashionSection>
      <Title
        title={title}
        subtitle={`${reversedProducts.length} ${
          reversedProducts.length === 1 ? "product" : "products"
        }`}
      />

      <div className={PRODUCT_GRID_CLASS}>
        {displayedProducts.map((product) => (
          <FashionProductCard
            key={product?._id?.toString()}
            product={product}
            href={`/fashion-lifestyle/shop/${
              params?.shopSlugId
            }/view-product/${slugify(product?.product_title_eng)}_${
              product?._id
            }`}
          />
        ))}
      </div>

      {reversedProducts.length > PAGE_SIZE && (
        <ShowMoreButton
          hasMore={hasMoreProducts}
          onClick={() =>
            hasMoreProducts
              ? setVisibleProductsCount((c) => c + PAGE_SIZE)
              : setVisibleProductsCount(PAGE_SIZE)
          }
        />
      )}
    </FashionSection>
  );
};

export default StoreProducts;
