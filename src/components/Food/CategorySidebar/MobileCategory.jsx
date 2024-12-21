"use client";
// import { categories } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
// import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { useSelector } from "react-redux";
// import { useShop } from "@/hooks/fetch-data/useShop";
import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { useFood } from "@/hooks/fetch-data/useFood";
import CategoryCardSkeleton from "./CategoryCardSkeleton";

const MobileCategory = ({ gridClass, toggleDrawer }) => {
  const router = useRouter();

  const { productCategory } = useSelector((state) => state.itemsByStore);

  const { progressing } = useFood();

  const handleCategoryClick = (categoryId) => {
    router.push(`/food-category/${categoryId}`);
    if (gridClass === "grid-cols-2") {
      toggleDrawer();
    }
  };

  return (
    <div className="block md:hidden">
      <div className={`grid ${gridClass} gap-5 justify-items-center my-5 mx-5`}>
        {progressing
          ? Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : productCategory.map((category) => (
              <div
                key={category._id}
                className="px-2 pt-2 flex flex-col justify-center items-center border rounded-lg cursor-pointer bg-white shadow-sm"
                onClick={() => handleCategoryClick(category.categoryInfo._id)}
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <Image
                    src={`${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`}
                    alt="category image"
                    width={200}
                    height={200}
                    className="rounded object-contain"
                  />
                  {/* <span className="text-sm text-gray-800 mt-1">
                    {category.categoryName}
                  </span> */}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default MobileCategory;
