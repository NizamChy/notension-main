"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FoodItems from "@/components/Food/FoodItems/FoodItems";
import FoodItemCardSkeleton from "@/components/Food/FoodItems/FoodItemCardSkeleton";

const FoodItemsByCategory = () => {
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const params = useParams();
  const catId = params?.catId || null;

  const { productInfoByShop } = useSelector((state) => state.itemsByStore);

  // const { foodCartStartAt } = useSelector((state) => state.cart);
  // console.log("foodCartStartAt : ", foodCartStartAt);

  useEffect(() => {
    if (!catId) return;

    setLoading(true);
    const categoryData = productInfoByShop.find(
      (category) => category?._id === catId
    );

    if (categoryData && categoryData?.catagory) {
      setCategoryName(categoryData?.catagory);
    }

    if (categoryData && categoryData?.itemsInfo) {
      setFoodItems(categoryData?.itemsInfo);
    } else {
      setFoodItems([]);
    }

    setLoading(false);
  }, [catId, productInfoByShop]);

  return (
    <div className="min-h-screen">
      <p className="md:text-3xl font-medium ps-2 lg:pt-2 text-deepGray">
        {categoryName}
      </p>
      <div className="flex-1 lg:pt-5 p-2">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <FoodItemCardSkeleton key={index} />
            ))}
          </div>
        ) : foodItems?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {foodItems?.map((item) => (
              <FoodItems key={item?._id} item={item} />
            ))}
          </div>
        ) : (
          categoryName && (
            <>
              <p className="text-center mt-20 lg:text-xl font-medium">
                {categoryName} items not available right now!
              </p>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default FoodItemsByCategory;
