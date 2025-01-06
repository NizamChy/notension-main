"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { use } from "react";
import FoodItemCardSkeleton from "@/components/Food/FoodItems/FoodItemCardSkeleton";
import FoodItems from "@/components/Food/FoodItems/FoodItems";

const Page = ({ params }) => {
  const category = use(params);
  const catId = category?.catId || null;

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { productInfoByShop } = useSelector((state) => state.itemsByStore);

  useEffect(() => {
    if (!catId) return;

    setLoading(true);

    const categoryData = productInfoByShop.find(
      (category) => category._id === catId
    );

    if (categoryData && categoryData.itemsInfo) {
      setFoodItems(categoryData.itemsInfo);
    } else {
      setFoodItems([]);
    }

    setLoading(false);
  }, [catId, productInfoByShop]);

  return (
    <div className="min-h-screen">
      <div className="flex-1 pt-5 p-2">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <FoodItemCardSkeleton key={index} />
            ))}
          </div>
        ) : foodItems.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {foodItems.map((item) => (
              <FoodItems key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-center mt-20 lg:text-xl font-medium">
            No food items available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
