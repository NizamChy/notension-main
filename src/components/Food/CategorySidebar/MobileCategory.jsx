"use client";

import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { useParams, usePathname, useRouter } from "next/navigation";

// Food categories as a grid of equal square tiles: below lg on the store
// page (4 → 6 columns) and, with gridClass="grid-cols-2", inside the
// mobile category drawer.
const MobileCategory = ({ gridClass, toggleDrawer }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { progressing } = useFood();
  const { productCategory } = useSelector((state) => state.itemsByStore);

  const inDrawer = gridClass === "grid-cols-2";

  const handleCategoryClick = (categoryId) => {
    router.push(
      `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/${categoryId}`
    );

    if (inDrawer) {
      toggleDrawer();
    }
  };

  useEffect(() => {
    const categoryIdFromUrl = pathname.split("/").pop();
    if (categoryIdFromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(categoryIdFromUrl);
    }
  }, [pathname]);

  return (
    <div className={inDrawer ? "block lg:hidden" : "lg:hidden"}>
      <div
        className={`grid gap-3 ${
          inDrawer ? "grid-cols-2 p-4" : "grid-cols-4 md:grid-cols-6"
        }`}
      >
        {progressing
          ? Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : productCategory?.map((category) => (
              <button
                type="button"
                key={category?._id}
                className={`aspect-square w-full p-1.5 flex items-center justify-center border-2 rounded-xl bg-white shadow-sm ${
                  activeCategory === category?.categoryInfo?._id
                    ? "border-primaryFood"
                    : "border-white"
                }`}
                onClick={() => handleCategoryClick(category?.categoryInfo?._id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    category?.categoryInfo?.banner_type_1
                      ? `${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`
                      : "/png/dummyImage.png"
                  }
                  alt="category"
                  className="w-full h-full rounded-lg object-contain"
                />
              </button>
            ))}
      </div>
    </div>
  );
};

export default MobileCategory;
