"use client";
import React from "react";
import { useSelector } from "react-redux";
import GroceryItems from "../GroceryItems/GroceryItems";
import ItemCardSkeleton from "../GroceryItems/ItemCardSkeleton";

const SpecialOffer = () => {
  const { specialOfferItem, isLoading } = useSelector(
    (state) => state.itemsByStore
  );

  return (
    <div>
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      )}

      {specialOfferItem.length > 0 && (
        <>
          <p className="text-lg md:text-2xl lg:text-3xl font-medium pb-2 md:pb-4">
            Special Offer
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {specialOfferItem.map((item) => (
              <GroceryItems key={item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SpecialOffer;
