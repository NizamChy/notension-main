"use client";

import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { useParams, usePathname, useRouter } from "next/navigation";

const MobileCategory = ({ gridClass, toggleDrawer }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const { progressing } = useFood();
  const { productCategory } = useSelector((state) => state.itemsByStore);

  const handleCategoryClick = (categoryId) => {
    router.push(`/food/store/${params?.store}/${categoryId}`);
    if (gridClass === "grid-cols-2") {
      toggleDrawer();
    }
  };

  useEffect(() => {
    const categoryIdFromUrl = pathname.split("/").pop();
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [pathname]);

  return (
    <div className="block lg:hidden">
      <div className={`grid ${gridClass} gap-5 justify-items-center my-5 mx-5`}>
        {progressing
          ? Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : productCategory.map((category) => (
              <div
                key={category._id}
                className={`flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer bg-white shadow-sm  
                  ${
                    activeCategory === category.categoryInfo._id
                      ? "border-primaryFood"
                      : "border-white"
                  }
                  `}
                onClick={() => handleCategoryClick(category.categoryInfo._id)}
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <img
                    src={`${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`}
                    alt="category"
                    width={76}
                    height={91}
                    className="rounded object-contain"
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default MobileCategory;
