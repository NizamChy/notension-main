import React from "react";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";

const SearchCenter = () => {
  return (
    <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto my-5 border text-mediumGray hover:border-primary hover:text-primary rounded-lg cursor-pointer">
      <Link href="/medical-services/search">
        <button className="h-10 ps-3 w-full flex justify-between items-center">
          <span>Search center</span>
          <span className="bg-primary h-full rounded-e-lg px-3 flex items-center justify-center">
            <IoSearch className="text-2xl text-white" />
          </span>
        </button>
      </Link>
    </div>
  );
};

export default SearchCenter;
