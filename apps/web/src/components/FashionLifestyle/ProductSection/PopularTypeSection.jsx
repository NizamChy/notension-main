"use client";

import React, { useState } from "react";
import Title from "../CategorySection/Title";
import FashionSection from "../shared/FashionSection";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { SECONDARY_BUTTON, Skeleton } from "@/components/shared/UI/UI";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../shared/Card/FashionProductCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const PAGE_SIZE = 8;

/** "View more / View less" toggle under a product grid. */
export const ShowMoreButton = ({ hasMore, onClick }) => (
  <div className="mt-8 text-center md:mt-10">
    <button type="button" onClick={onClick} className={SECONDARY_BUTTON}>
      {hasMore ? "View more products" : "View less"}
      {hasMore ? <HiChevronDown /> : <HiChevronUp />}
    </button>
  </div>
);

/** Popular products of one fashion type (Men / Women / Kids) with View More. */
const PopularTypeSection = ({
  typeId,
  typeSlug,
  title,
  subtitle,
  errorText,
  className = "",
}) => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(PAGE_SIZE);

  const { usePopularProductsByType } = useCategoryItem();
  const { data: productInfo, isLoading, isError } =
    usePopularProductsByType(typeId);

  if (isLoading)
    return (
      <FashionSection className={className}>
        <Skeleton className="mb-6 h-7 w-1/2 !rounded-full sm:w-1/3 lg:w-1/4" />
        <div className={PRODUCT_GRID_CLASS}>
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </FashionSection>
    );

  if (isError) {
    return (
      <FashionSection className={className}>
        <Title title={title} />
        <p className="py-6 text-center text-sm text-[#D92D20]">{errorText}</p>
      </FashionSection>
    );
  }

  if (!productInfo || productInfo?.length === 0) return null;

  const reversedProducts = [...productInfo].reverse();
  const displayedProducts = reversedProducts.slice(0, visibleProductsCount);
  const hasMoreProducts = reversedProducts.length > visibleProductsCount;

  return (
    <FashionSection className={className}>
      <Title
        title={title}
        subtitle={subtitle}
        href={typeSlug ? `/fashion-lifestyle/type/${typeSlug}_${typeId}` : undefined}
        linkLabel="Shop all"
      />

      <div className={PRODUCT_GRID_CLASS}>
        {displayedProducts.map((product) => (
          <FashionProductCard
            key={product?._id?.toString()}
            product={product}
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

export default PopularTypeSection;
