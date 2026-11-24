"use client";

import React from "react";
import { useFoodStore } from "@/hooks/food/useFoodStore";
import { useParams } from "next/navigation";
import MenuSection, { MenuSkeleton } from "./MenuSection";
import { EmptyState } from "@/components/shared/UI/UI";
import type { FoodItem } from "@/lib/api/food";

const FoodItemsByCategory = () => {
  const params = useParams<{ catId?: string }>();
  const catId = params?.catId || null;

  const { productInfoByShop } = useFoodStore();

  if (!catId) return <MenuSkeleton />;

  // Derived from the cached restaurant menu during render.
  const categoryData = productInfoByShop.find(
    (category) => category?._id === catId
  );
  const categoryName = categoryData?.catagory || "";
  const foodItems: FoodItem[] = categoryData?.itemsInfo || [];

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
