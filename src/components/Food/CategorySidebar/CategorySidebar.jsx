"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { useSelector } from "react-redux";
import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { useFood } from "@/hooks/fetch-data/useFood";

const CategorySidebar = ({ scrollToFoodItems }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  const params = useParams();

  const { progressing } = useFood();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);

    router.push(`/food/store/${params?.store}/${categoryId}`);
  };

  const { productCategory } = useSelector((state) => state.itemsByStore);

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
      <div className="max-w-screen-md hidden lg:block">
        <div className="h-full border-e ps-7 max-w-screen-md py-16 bg-[#F3F4F6]">
          <div className="overflow-y-auto overflow-x-hidden h-[85vh] no-scrollbar mt-10">
            <div className="grid grid-cols-2 gap-5 justify-items-center my-5 mx-5">
              {progressing
                ? Array.from({ length: 6 }).map((_, index) => (
                    <CategoryCardSkeleton key={index} />
                  ))
                : productCategory.map((category) => (
                    <div
                      key={category._id}
                      className={`max-w-32 px-2 pt-2 flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer bg-white shadow-sm ${
                        activeCategory === category.categoryInfo._id
                          ? "border-primaryFood"
                          : "border-white"
                      }`}
                      onClick={() =>
                        handleCategoryClick(category.categoryInfo._id)
                      }
                    >
                      <div className="flex flex-col justify-center items-center text-center">
                        <Image
                          src={
                            category?.categoryInfo?.banner_type_1
                              ? `${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`
                              : "/png/dummyImage.png"
                          }
                          alt="category image"
                          width={200}
                          height={200}
                          className="rounded object-contain"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;
