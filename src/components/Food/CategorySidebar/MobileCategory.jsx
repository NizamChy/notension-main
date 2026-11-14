"use client";

import React from "react";
import useMenuNav from "./useMenuNav";
import { useFood } from "@/hooks/fetch-data/useFood";
import CategoryCardSkeleton from "./CategoryCardSkeleton";

// Restaurant menu categories as a grid of pills below lg (4 → 6 columns) or,
// with gridClass="grid-cols-2", inside a category drawer.
const MobileCategory = ({ gridClass, toggleDrawer }) => {
  const inDrawer = gridClass === "grid-cols-2";

  const { progressing } = useFood();
  const { items, activeId, goTo } = useMenuNav();

  const handleClick = (id) => {
    goTo(id);
    if (inDrawer) toggleDrawer?.();
  };

  return (
    <div className={inDrawer ? "block lg:hidden" : "lg:hidden"}>
      <div
        className={`grid gap-2 ${
          inDrawer ? "grid-cols-2 p-4" : "grid-cols-2 sm:grid-cols-4 md:grid-cols-6"
        }`}
      >
        {progressing
          ? Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))
          : items.map((item) => {
              const active = activeId === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  aria-current={active ? "true" : undefined}
                  onClick={() => handleClick(item.id)}
                  className={`min-h-10 truncate rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "border-[#0C3F8E] bg-[#0C3F8E]/10 text-[#0C3F8E] dark:border-[#7FB2FF] dark:text-[#7FB2FF]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
      </div>
    </div>
  );
};

export default MobileCategory;
