"use client";

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useParams, useRouter } from "next/navigation";
import { getStoreModule } from "./storeModules";

// One search box for both store search (on the module home page) and
// item search (inside a store). `scope` picks the target page.
const SearchBar = ({ moduleName, scope = "item" }) => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();
  const params = useParams();
  const { basePath, searchInputFocusClass, searchButtonClass } =
    getStoreModule(moduleName);

  const isStoreSearch = scope === "store";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchText.trim();
    if (query.length < 2) return;

    const encoded = encodeURIComponent(query);
    router.push(
      isStoreSearch
        ? `${basePath}/home/search-store?query=${encoded}`
        : `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}/search?query=${encoded}`
    );
  };

  // Store search keeps the original blue styling in both modules.
  const inputFocusClass = isStoreSearch
    ? "focus:ring-blue-500 focus:border-blue-500"
    : searchInputFocusClass;
  const buttonClass = isStoreSearch
    ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
    : searchButtonClass;

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          type="text"
          className={`w-full ${
            isStoreSearch ? "py-3" : "py-2 md:py-3"
          } px-5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 ${inputFocusClass}`}
          placeholder={isStoreSearch ? "Search store" : "Search item"}
          aria-label={isStoreSearch ? "Search store" : "Search item"}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {searchText.trim().length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setSearchText("")}
            className="absolute top-1/2 transform -translate-y-1/2 right-14 bg-gray-100 text-gray-500 p-1.5 rounded-xl hover:bg-gray-200 focus:outline-none"
          >
            <RxCross2 className={isStoreSearch ? "w-5 h-5" : "md:w-5 md:h-5"} />
          </button>
        )}

        <button
          type="submit"
          aria-label="Search"
          className={`absolute top-1/2 transform -translate-y-1/2 right-4 text-white p-2 rounded-xl focus:outline-none focus:ring-1 ${buttonClass}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={isStoreSearch ? "w-5 h-5" : "w-4 h-4 md:w-5 md:h-5"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
