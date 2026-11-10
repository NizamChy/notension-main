"use client";

import React from "react";
import { useSelector } from "react-redux";
import EmptyWishlist from "./EmptyWishlist";
import Title from "../CategorySection/Title";
import FashionSection from "../shared/FashionSection";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../shared/Card/FashionProductCard";

const WishlistProduct = () => {
  const favouriteFashionItems = useSelector(
    (state) => state.userChoice.favouriteFashionItems
  );

  if (!favouriteFashionItems || favouriteFashionItems?.length === 0)
    return <EmptyWishlist />;

  return (
    <FashionSection className="min-h-content">
      <Title title="Wishlist Items" />
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
