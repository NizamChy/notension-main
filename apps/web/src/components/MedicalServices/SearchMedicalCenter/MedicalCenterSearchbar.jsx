"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/shared/Search/SearchInput";

const MedicalCenterSearchbar = () => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const handleSearch = (query) => {
    if (query.length > 1) {
      router.push(
        `/medical-services/search/search-center?query=${encodeURIComponent(query)}`,
      );
    }
  };

  return (
    <SearchInput
      size="lg"
      value={searchText}
      onChange={setSearchText}
      onSubmit={handleSearch}
      placeholder="Search hospitals and medical centers"
    />
  );
};

export default MedicalCenterSearchbar;
