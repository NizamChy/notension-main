"use client";

import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";

const MedicalCenterSearchbar = () => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchText.trim().length > 1) {
      router.push(`/medical-services/search/search-center?query=${searchText}`);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          type="text"
          className="w-full h-11 ps-4 pe-24 text-sm md:text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          placeholder="Search here"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        {searchText.trim().length > 0 && (
          <button
            type="button"
            onClick={clearSearchText}
            aria-label="Clear search"
            className="absolute top-1/2 -translate-y-1/2 right-14 bg-gray-100 text-gray-500 p-1 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            <RxCross2 className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="absolute inset-y-0 right-0 w-12 flex items-center justify-center bg-primary text-white rounded-e-lg hover:bg-[#264066] focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
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

export default MedicalCenterSearchbar;
