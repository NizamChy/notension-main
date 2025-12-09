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
        `/fashion_lifestyle/search-product?query=${searchText}&type_id=${selectedType}`
      );
    }
  };

  return (
    <div className="hidden lg:flex justify-center items-center px-4">
      <div className="w-full max-w-xl">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white shadow-md rounded-full overflow-hidden border border-gray-300"
        >
          {/* Dropdown */}
          <select
            className="bg-transparent px-4 py-2 text-gray-700 text-sm focus:outline-none cursor-pointer border-r border-gray-300"
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
            className="flex-1 px-4 py-2 bg-transparent text-gray-700 text-sm focus:outline-none"
            placeholder="Search products..."
            autoComplete="off"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Search Button */}
          <button
            type="submit"
            className="me-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-all"
          >
            <IoSearch className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductSearchbar;
