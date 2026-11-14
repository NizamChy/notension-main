"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import MenuSection, { MenuSkeleton } from "./MenuSection";
import { EmptyState } from "@/components/shared/UI/UI";

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

  if (loading) return <MenuSkeleton />;

  if (foodItems?.length > 0) {
    return (
      <MenuSection
        title={categoryName}
        subtitle={`${foodItems.length} item${foodItems.length === 1 ? "" : "s"}`}
        items={foodItems}
      />
    );
  }

  return categoryName ? (
    <EmptyState
      title={`No ${categoryName} right now`}
      text="These dishes aren't available at the moment. Try another category."
    />
  ) : null;
};

export default FoodItemsByCategory;
