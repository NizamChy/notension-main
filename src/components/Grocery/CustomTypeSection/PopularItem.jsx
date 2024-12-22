"use client";
import React from "react";
import { useSelector } from "react-redux";
import GroceryItems from "../GroceryItems/GroceryItems";
import ItemCardSkeleton from "../GroceryItems/ItemCardSkeleton";

const PopularItem = () => {
  const { popularItem, isLoading } = useSelector((state) => state.itemsByStore);

  return (
    <div>
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      )}

      {popularItem.length > 0 && (
        <>
          <p className="text-3xl font-medium pb-5">Popular Items</p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {popularItem.map((item) => (
              <GroceryItems key={item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PopularItem;
