import React from "react";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";

// Looks like a search field and opens the medical-center search page.
const SearchCenter = ({
  label = "Search hospitals, diagnostic and care centres",
  className = "",
}) => {
  return (
    <Link
      href="/medical-services/search"
      aria-label="Search medical centres"
      className={`group mx-auto flex h-12 w-full max-w-2xl items-center gap-3 rounded-full border border-gray-200 bg-white pl-4 pr-1.5 text-gray-500 shadow-sm shadow-gray-900/[0.03] transition-colors hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] ${className}`}
    >
      <LuSearch className="shrink-0 text-lg text-gray-400" />
      <span className="min-w-0 flex-1 truncate text-sm md:text-[15px]">
        {label}
      </span>
      <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-[#0C3F8E] px-4 text-sm font-semibold text-white transition-colors group-hover:bg-[#0A3478]">
        Search
      </span>
    </Link>
  );
};

export default SearchCenter;
