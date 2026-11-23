"use client";

import { useSessionStore } from "@/stores/sessionStore";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import React, { type ReactNode } from "react";
import { useFoodCategory } from "@/hooks/food/useFoodModule";
import { PAGE_CONTAINER } from "@/components/shared/UI/UI";

// Header band of a food store category (/food/[id]/...): back link, the
// category name and, as children, the store search bar.
// The page below loads the category list when it's missing (useFoodCategory);
// this header only reads it, so a direct visit makes one request, not two.
type Props = { children?: ReactNode };

const SelectedCategory = ({ children }: Props) => {
  // Shares the page's category query, so a direct visit makes one request.
  const { category: selectedCategory } = useFoodCategory();
  const location = useSessionStore((s) => s.currentUserLocation?.districtName);

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
