import React from "react";
import { HiOutlineArchiveBox } from "react-icons/hi2";

// Empty result block used inside product / order lists.
const NoItemFound = () => {
  return (
    <div className="flex w-full items-center justify-center py-10 md:py-16">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EB5C2F]/10 text-3xl text-[#EB5C2F]">
          <HiOutlineArchiveBox aria-hidden="true" />
        </span>
        <p className="mt-4 text-base font-semibold text-gray-900">
          No items found
        </p>
        <p className="mt-1 max-w-xs text-sm text-gray-500">
          Try a different search or check back a little later.
        </p>
      </div>
    </div>
  );
};

export default NoItemFound;
