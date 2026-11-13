"use client";

import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import navItems from "../../../../../public/data/navItems.json";

const ProductSearchbar = () => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const firstRowItems = navItems.slice(0, 7);

  const [selectedType, setSelectedType] = useState(
    firstRowItems[0]?.type_id || ""
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (selectedType && searchText.trim().length > 2) {
      router.push(
        `/fashion-lifestyle/search-product?query=${searchText}&type_id=${selectedType}`
      );
    }
  };

  return (
    <div className="flex justify-center items-center px-4 lg:px-0">
      <div className="w-full max-w-xl">
        <form
          onSubmit={handleSearchSubmit}
          className="flex h-11 items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 transition-colors focus-within:border-gray-300 focus-within:bg-white"
        >
          {/* Dropdown */}
          <select
            aria-label="Product type"
            className="h-full max-w-[40%] bg-transparent pl-4 pr-2 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer border-r border-gray-200"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {firstRowItems?.map((item) => (
              <option key={item?.type_id} value={item?.type_id}>
                {item?.type_name}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="search"
            aria-label="Search products"
            className="min-w-0 flex-1 px-4 py-2 bg-transparent text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none"
            placeholder="Search products..."
            autoComplete="off"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Search Button */}
          <button
            type="submit"
            aria-label="Search"
            className="me-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0C3F8E] text-white transition-colors hover:bg-[#0A3478]"
          >
            <IoSearch className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductSearchbar;
