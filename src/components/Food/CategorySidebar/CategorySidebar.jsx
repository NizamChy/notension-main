"use client";

import React from "react";
import useMenuNav from "./useMenuNav";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { CARD } from "@/components/shared/UI/UI";

// Restaurant menu categories on lg+: a sticky list beside the menu.
// `setIsScroll` tells the store layout to bring the menu into view after
// opening another category page.
const CategorySidebar = ({ setIsScroll, loading = false }) => {
  const { items, activeId, goTo } = useMenuNav({
    onNavigate: () => setIsScroll?.(true),
  });

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="Menu categories"
        className={`${CARD} sticky top-[88px] max-h-[calc(100vh-112px)] overflow-y-auto p-2 [scrollbar-width:thin]`}
      >
        <p className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Menu
        </p>
        {loading ? (
          <div className="space-y-1.5 p-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {items.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => goTo(item.id)}
                    className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "bg-[#0C3F8E]/10 font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]"
                        : "font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="min-w-0 truncate">{item.name}</span>
                    {item.count > 0 && (
                      <span
                        className={`shrink-0 text-xs tabular-nums ${
                          active ? "" : "text-gray-400"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default CategorySidebar;
