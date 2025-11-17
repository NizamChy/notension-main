import React from "react";
import { IoSearch } from "react-icons/io5";
import navItems from "../../../../../public/data/navItems.json";

const ProductSearchbar = () => {
  const firstRowItems = navItems.slice(0, 7);

  return (
    <div className="hidden lg:flex justify-center items-center px-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center bg-white shadow-md rounded-full overflow-hidden border border-gray-300">
          <select className="bg-transparent px-4 py-2 text-gray-700 text-sm focus:outline-none cursor-pointer border-r border-gray-300">
            {firstRowItems?.map((item) => (
              <option key={item?.type_id} className="text-gray-700">
                {item?.type_name}
              </option>
            ))}
          </select>

          <input
            type="search"
            className="flex-1 px-4 py-2 bg-transparent text-gray-700 text-sm focus:outline-none"
            placeholder="Search products..."
            autoComplete="off"
          />

          <button className="me-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-all">
            <IoSearch className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchbar;
