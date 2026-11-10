"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useFood } from "@/hooks/fetch-data/useFood";
import FoodItems from "@/components/Food/FoodItems/FoodItems";
import MobileCategory from "@/components/Food/CategorySidebar/MobileCategory";
import FoodItemCardSkeleton from "@/components/Food/FoodItems/FoodItemCardSkeleton";
import {
  ITEM_GRID_CLASS,
  SECTION_TITLE_CLASS,
} from "@/components/StoreModule/storeModules";

const FoodItemsHome = () => {
  const { progressing } = useFood();
  const { popularItem } = useSelector((state) => state.itemsByStore);

  return (
    <div className="space-y-6 md:space-y-8">
      <MobileCategory />
      {progressing ? (
        <div className={ITEM_GRID_CLASS}>
          {Array.from({ length: 4 }).map((_, index) => (
            <FoodItemCardSkeleton key={index} />
          ))}
        </div>
      ) : popularItem?.length ? (
        <section>
          <h2 className={SECTION_TITLE_CLASS}>Popular Items</h2>
          <div className={ITEM_GRID_CLASS}>
            {popularItem?.map((item) => (
              <FoodItems key={item?._id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default FoodItemsHome;
