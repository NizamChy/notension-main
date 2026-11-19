"use client";

import React, { useEffect, useRef } from "react";
import useMenuNav from "./useMenuNav";

// Restaurant menu tabs below lg: a horizontally scrolling row of pills that
// sticks under the navbar. The active pill is kept in view.
const CategorySlider = ({ onNavigate, className = "" }) => {
  const { items, activeId, goTo } = useMenuNav({ onNavigate });
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector('[aria-current="true"]');
    if (!scroller || !active) return;

    const left =
      active.offsetLeft - scroller.clientWidth / 2 + active.clientWidth / 2;
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [activeId]);

  if (!items.length) return null;

  return (
    <nav
      aria-label="Menu categories"
      className={`sticky top-16 z-20 -mx-4 border-b border-gray-200 bg-white/95 backdrop-blur sm:-mx-6 lg:hidden ${className}`}
    >
      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <button
              type="button"
              key={item.id}
              aria-current={active ? "true" : undefined}
              onClick={() => goTo(item.id)}
              className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#0C3F8E] text-white shadow-sm shadow-[#0C3F8E]/20"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {item.name}
              {item.count > 0 && (
                <span
                  className={`text-xs tabular-nums ${
                    active ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategorySlider;
