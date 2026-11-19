"use client";

import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const MobileFilterButton = ({ onClick, filterCount }) => {
  return (
    <button
      type="button"
      id="filter-button"
      onClick={onClick}
      className="fixed bottom-5 left-1/2 z-30 flex h-11 -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0C3F8E]/30 transition-colors hover:bg-[#0A3478] md:hidden"
    >
      <HiOutlineAdjustmentsHorizontal className="text-lg" />
      Filters
      {filterCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFFFFF] px-1.5 text-xs font-bold tabular-nums text-[#0C3F8E]">
          {filterCount}
        </span>
      )}
    </button>
  );
};

export default MobileFilterButton;
