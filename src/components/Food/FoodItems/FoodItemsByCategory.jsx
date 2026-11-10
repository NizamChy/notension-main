"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FoodItems from "@/components/Food/FoodItems/FoodItems";
import FoodItemCardSkeleton from "@/components/Food/FoodItems/FoodItemCardSkeleton";
import {
  ITEM_GRID_CLASS,
  SECTION_TITLE_CLASS,
} from "@/components/StoreModule/storeModules";

const FoodItemsByCategory = () => {
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const params = useParams();
  const catId = params?.catId || null;

  const { productInfoByShop } = useSelector((state) => state.itemsByStore);

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
    <div>
      {categoryName && <h2 className={SECTION_TITLE_CLASS}>{categoryName}</h2>}
      <div>
        {loading ? (
          <div className={ITEM_GRID_CLASS}>
            {Array.from({ length: 4 }).map((_, index) => (
              <FoodItemCardSkeleton key={index} />
            ))}
          </div>
        ) : foodItems?.length > 0 ? (
          <div className={ITEM_GRID_CLASS}>
            {foodItems?.map((item) => (
              <FoodItems key={item?._id} item={item} />
            ))}
          </div>
        ) : (
          categoryName && (
            <>
              <p className="text-center mt-20 lg:mt-44 lg:text-xl font-medium">
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
