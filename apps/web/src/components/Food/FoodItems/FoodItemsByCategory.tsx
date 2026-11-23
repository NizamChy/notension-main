"use client";

import React, { useEffect, useState } from "react";
import { useFoodStore } from "@/hooks/food/useFoodStore";
import { useParams } from "next/navigation";
import MenuSection, { MenuSkeleton } from "./MenuSection";
import { EmptyState } from "@/components/StoreModule/legacyViews";
import type { FoodItem } from "@/lib/api/food";

const FoodItemsByCategory = () => {
  const [loading, setLoading] = useState(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categoryName, setCategoryName] = useState("");

  const params = useParams<{ catId?: string }>();
  const catId = params?.catId || null;

  const { productInfoByShop } = useFoodStore();

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
