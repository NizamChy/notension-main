"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useFood } from "@/hooks/fetch-data/useFood";
import FoodItems from "@/components/Food/FoodItems/FoodItems";
import MobileCategory from "@/components/Food/CategorySidebar/MobileCategory";
import FoodItemCardSkeleton from "@/components/Food/FoodItems/FoodItemCardSkeleton";

const FoodItemsHome = () => {
  const { progressing } = useFood();
  const { popularItem } = useSelector((state) => state.itemsByStore);

  return (
    <>
      <MobileCategory gridClass="grid-cols-3" />
      <div className="flex-1 pt-5 p-2">
        {progressing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <FoodItemCardSkeleton key={index} />
            ))}
          </div>
        ) : popularItem.length ? (
          <>
            <p className="text-3xl font-medium pb-5 text-deepGray">
              Popular Items
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
              {popularItem.map((item) => (
                <FoodItems key={item?._id} item={item} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default FoodItemsHome;
