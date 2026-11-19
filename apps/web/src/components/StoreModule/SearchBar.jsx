"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchInput from "@/components/shared/Search/SearchInput";
import { getStoreModule } from "./storeModules";

// One search box for both store search (on the module home page) and
// item search (inside a store). `scope` picks the target page.
// `onSubmitted` runs after a search starts (the navbar closes its panel).
const SearchBar = ({
  moduleName,
  scope = "item",
  autoFocus = false,
  onSubmitted,
  size = "md",
}) => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();
  const params = useParams();
  const { basePath } = getStoreModule(moduleName);

  const isStoreSearch = scope === "store";

  const handleSearch = (query) => {
    if (query.length < 2) return;

    const encoded = encodeURIComponent(query);
    router.push(
      isStoreSearch
        ? `${basePath}/home/search-store?query=${encoded}`
        : `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}/search?query=${encoded}`,
    );
    onSubmitted?.();
  };

  return (
    <SearchInput
      value={searchText}
      onChange={setSearchText}
      onSubmit={handleSearch}
      autoFocus={autoFocus}
      size={size}
      placeholder={
        isStoreSearch
          ? "Search stores near you"
          : `Search ${moduleName === "medicine" ? "medicines" : "products"} in this store`
      }
    />
  );
};

export default SearchBar;
