"use client";

import React from "react";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

// The one search field used across the site. Callers own the state and
// what happens on submit.
// - `leading`: optional control before the input (e.g. a type <select>)
// - `size`: "md" (44px) or "lg" (52px)
const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search",
  label,
  leading,
  autoFocus = false,
  size = "md",
  className = "",
}) => {
  const large = size === "lg";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`group flex w-full items-center rounded-full border border-gray-200 bg-white shadow-sm shadow-gray-900/5 transition focus-within:border-[#0C3F8E]/40 focus-within:ring-4 focus-within:ring-[#0C3F8E]/10 dark:focus-within:border-[#7FB2FF]/50 dark:focus-within:ring-[#7FB2FF]/10 ${
        large ? "h-[52px]" : "h-11"
      } ${className}`}
    >
      {leading}

      <IoSearch
        aria-hidden
        className={`shrink-0 text-gray-400 transition-colors group-focus-within:text-gray-600 ${
          leading ? "ml-3" : "ml-4"
        } ${large ? "text-xl" : "text-lg"}`}
      />

      <input
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        autoFocus={autoFocus}
        aria-label={label || placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-full min-w-0 flex-1 bg-transparent px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden ${
          large ? "text-base" : "text-sm"
        }`}
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <RxCross2 />
        </button>
      )}

      <button
        type="submit"
        aria-label="Search"
        className={`mr-1 flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#0C3F8E] font-semibold text-white transition-colors hover:bg-[#0A3478] ${
          large ? "h-10 px-3 text-sm sm:px-5" : "h-9 px-3 text-sm sm:px-4"
        }`}
      >
        <IoSearch className="text-base sm:hidden" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
};

export default SearchInput;
