"use client";

import React from "react";
import FoodItems from "./FoodItems";
import FoodItemCardSkeleton from "./FoodItemCardSkeleton";
import { menuSectionId } from "@/components/Food/CategorySidebar/useMenuNav";

export const DISH_GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4";

// One titled block of a restaurant menu. `sectionId` makes it a scroll
// target for the category tabs.
const MenuSection = ({ sectionId, title, subtitle, items = [], action }) => (
  <section
    id={sectionId ? menuSectionId(sectionId) : undefined}
    data-menu-section={sectionId || undefined}
  >
    <div className="mb-3 flex items-end justify-between gap-3 md:mb-4">
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className={DISH_GRID}>
      {items.map((item) => (
        <FoodItems key={item?._id} item={item} />
      ))}
    </div>
  </section>
);

export const MenuSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    <div className="h-6 w-40 animate-pulse rounded-lg bg-gray-100" />
    <div className={DISH_GRID}>
      {Array.from({ length: count }).map((_, index) => (
        <FoodItemCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default MenuSection;
