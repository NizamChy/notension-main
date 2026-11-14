"use client";

import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/shared/Search/SearchInput";
import navItems from "../../../../../public/data/navItems.json";

const TYPES = navItems.slice(0, 7);

// Fashion product search: pick a product type, then search inside it.
// `onSubmitted` runs after a search starts (the navbar closes its panel).
const ProductSearchbar = ({ autoFocus = false, onSubmitted }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState(TYPES[0]?.type_id || "");
  const router = useRouter();

  const handleSearch = (query) => {
    if (!selectedType || query.length <= 2) return;
    router.push(
      `/fashion-lifestyle/search-product?query=${encodeURIComponent(query)}&type_id=${selectedType}`,
    );
    onSubmitted?.();
  };

  const typeSelect = (
    <span className="relative flex h-full shrink-0 items-center border-r border-gray-200">
      <select
        aria-label="Product type"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="h-full max-w-[6.5rem] cursor-pointer appearance-none truncate rounded-l-full bg-transparent pl-4 pr-7 text-sm font-medium text-gray-700 focus:outline-none sm:max-w-none"
      >
        {TYPES.map((item) => (
          <option key={item?.type_id} value={item?.type_id}>
            {item?.type_name}
          </option>
        ))}
      </select>
      <HiChevronDown className="pointer-events-none absolute right-3 text-gray-400" />
    </span>
  );

  return (
    <SearchInput
      leading={typeSelect}
      value={searchText}
      onChange={setSearchText}
      onSubmit={handleSearch}
      autoFocus={autoFocus}
      placeholder="Search products"
    />
  );
};

export default ProductSearchbar;
