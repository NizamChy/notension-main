"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { HiChevronLeft } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { PAGE_CONTAINER } from "@/components/shared/UI/UI";

// Header band of a food store category (/food/[id]/...): back link, the
// category name and, as children, the store search bar.
const SelectedCategory = ({ children }) => {
  const [catId, setCatId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const shopCategory = useSelector((state) => state.dashboard.shopCategory);
  const location = useSelector(
    (state) => state.user.currentUserLocation?.districtName
  );

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const categoryId = pathSegments.find((segment) =>
      /^[a-f0-9]{24}$/.test(segment)
    );

    setCatId(categoryId);
  }, []);

  useEffect(() => {
    if (catId && shopCategory) {
      const category = shopCategory?.find((item) => item._id === catId);
      setSelectedCategory(category);
    }
  }, [catId, shopCategory]);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className={`${PAGE_CONTAINER} py-5 md:py-8`}>
        <Link
          href="/food"
          className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <HiChevronLeft className="text-lg" />
          All categories
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {selectedCategory?.store_category_name || "Restaurants"}
        </h1>
        <p className="mt-1 text-sm text-gray-500 md:text-base">
          {location
            ? `Restaurants and food stores delivering to ${location}`
            : "Restaurants and food stores near you"}
        </p>
        {children && <div className="mt-4 max-w-2xl md:mt-5">{children}</div>}
      </div>
    </div>
  );
};

export default SelectedCategory;
