import React from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";

// Looks like a search field (bordered, white, button attached on the right)
// and opens the medical-center search page.
const SearchCenter = () => {
  return (
    <Link
      href="/medical-services/search"
      aria-label="Search center"
      className="group mx-auto flex h-11 w-full max-w-xl items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white text-mediumGray shadow-sm transition-colors hover:border-primary hover:text-primary"
    >
      <span className="flex flex-1 items-center px-4 text-sm md:text-base">
        Search center
      </span>
      <span className="flex w-12 items-center justify-center bg-primary">
        <IoSearch className="text-xl text-white" />
      </span>
    </Link>
  );
};

export default SearchCenter;
