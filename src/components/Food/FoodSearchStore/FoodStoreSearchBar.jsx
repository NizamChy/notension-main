"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SearchInput from "@/components/shared/Search/SearchInput";

// Store search inside a food category (/food/[id]/...).
const FoodStoreSearchBar = () => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();
  const params = useParams();
  const catId = /^[a-f0-9]{24}$/.test(params?.id || "") ? params.id : null;

  const handleSearch = (query) => {
    if (query.length > 1 && catId) {
      router.push(
        `/food/${catId}/search-store?query=${encodeURIComponent(query)}`,
      );
    }
  };

  return (
    <SearchInput
      size="lg"
      value={searchText}
      onChange={setSearchText}
      onSubmit={handleSearch}
      placeholder="Search restaurants and food stores"
    />
  );
};

export default FoodStoreSearchBar;
