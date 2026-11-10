"use client";

import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { useRouter, usePathname, useParams } from "next/navigation";

const CategorySidebar = ({ scrollToFoodItems, setIsScroll }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { progressing } = useFood();
  const { productCategory } = useSelector((state) => state.itemsByStore);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setIsScroll(true);

    router.push(
      `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/${categoryId}`
    );
  };

  useEffect(() => {
    const categoryIdFromUrl = pathname.split("/").pop();
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [pathname]);

  useEffect(() => {
    if (activeCategory) {
      scrollToFoodItems();
    }
  }, [activeCategory, scrollToFoodItems]);

  return (
    <>
      {/* Sits under the fixed food navbar (65px) and scrolls on its own. */}
      <aside className="hidden lg:flex flex-col h-full pt-[65px] border-e border-gray-200 bg-[#F3F4F6]">
        <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-5 xl:p-6">
          <div className="grid grid-cols-2 gap-3 xl:gap-4">
            {progressing
              ? Array.from({ length: 6 }).map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))
              : productCategory.map((category) => (
                  <button
                    type="button"
                    key={category?._id}
                    className={`aspect-square w-full p-1.5 flex items-center justify-center border-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow ${
                      activeCategory === category.categoryInfo._id
                        ? "border-primaryFood"
                        : "border-white"
                    }`}
                    onClick={() =>
                      handleCategoryClick(category.categoryInfo._id)
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        category?.categoryInfo?.banner_type_1
                          ? `${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`
                          : "/png/dummyImage.png"
                      }
                      alt="category image"
                      className="w-full h-full rounded-lg object-contain"
                    />
                  </button>
                ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default CategorySidebar;
