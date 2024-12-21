"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GrPrevious, GrNext } from "react-icons/gr";
import { useSelector } from "react-redux";
import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";

const CategorySlider = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const router = useRouter();
  const pathname = usePathname();

  const { productCategory } = useSelector((state) => state.itemsByStore);

  const categoryIdFromUrl = pathname.split("/").pop();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    router.push(`/food-category/${categoryId}`);
  };

  const handleNext = () => {
    const nextIndex =
      currentIndex + itemsPerPage >= productCategory.length
        ? 0
        : currentIndex + itemsPerPage;
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex =
      currentIndex - itemsPerPage < 0
        ? productCategory.length - itemsPerPage
        : currentIndex - itemsPerPage;
    setCurrentIndex(prevIndex);
  };

  const visibleCategories = productCategory.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  useEffect(() => {
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between my-5 mx-3">
        <button
          onClick={handlePrevious}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <GrPrevious />
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 justify-items-center">
          {visibleCategories.map((category) => (
            <div
              key={category._id}
              className={`max-h-32 bg-white max-w-32 p-2 flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer ${
                activeCategory === category.categoryInfo._id
                  ? "border-primary"
                  : "border-white"
              }`}
              onClick={() => handleCategoryClick(category.categoryInfo._id)}
            >
              <div className="flex flex-col justify-center items-center text-center text-sm">
                <Image
                  src={`${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`}
                  alt={category.categoryName}
                  width={120}
                  height={120}
                  className="rounded object-cover h-16"
                />
                <span>{category.categoryName}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <GrNext />
        </button>
      </div>
    </div>
  );
};

export default CategorySlider;
