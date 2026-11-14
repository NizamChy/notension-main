"use client";

import React from "react";
import { useSelector } from "react-redux";
import EmptyWishlist from "./EmptyWishlist";
import FashionSection from "../shared/FashionSection";
import { PageHeader } from "@/components/shared/UI/UI";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../shared/Card/FashionProductCard";

const WishlistProduct = () => {
  const favouriteFashionItems = useSelector(
    (state) => state.userChoice.favouriteFashionItems
  );

  if (!favouriteFashionItems || favouriteFashionItems?.length === 0)
    return <EmptyWishlist />;

  const count = favouriteFashionItems.length;

  return (
    <FashionSection className="min-h-content !pt-6 md:!pt-10">
      <PageHeader
        title="Wishlist"
        subtitle={`${count} saved ${count === 1 ? "item" : "items"}`}
      />
      <div className={PRODUCT_GRID_CLASS}>
        {favouriteFashionItems.map((product) => (
          <FashionProductCard
            key={product?._id?.toString()}
            product={product}
          />
        ))}
      </div>
    </FashionSection>
  );
};

export default WishlistProduct;
