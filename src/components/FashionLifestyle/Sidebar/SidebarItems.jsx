"use client";

import Link from "next/link";
import React, { useState } from "react";
import { slugify } from "../utils/slugify";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsChevronDown, BsPerson } from "react-icons/bs";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const SidebarItems = ({ onClose }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeCatMenu, setActiveCatMenu] = useState(null);

  const { navItems, isLoading } = useCategoryItem();

  if (isLoading) {
    return (
      <div className="bg-white h-[90vh] flex justify-center items-center animate-pulse">
        <div className="flex flex-col gap-5 justify-center items-center border-b h-10 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-h-8 border w-56 bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!navItems) {
    return (
      <div className="bg-white w-full h-[90vh] flex justify-center items-center">
        <div className="relative hidden lg:flex justify-center items-center border-b h-12">
          <p className="text-red-600">Something went wrong!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b">
        <ul className="space-y-4">
          {navItems?.map((navItem) => (
            <li key={navItem?.type_name}>
              <button
                className="flex items-center text-start justify-between w-full font-medium hover:text-blue-600 transition-colors duration-200"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === navItem?.type_name
                      ? null
                      : navItem?.type_name
                  )
                }
              >
                {navItem?.type_name}
                <BsChevronDown
                  className={`transition-transform duration-300 ${
                    activeMenu === navItem?.type_name ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeMenu === navItem?.type_name
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="pl-4 mt-2 space-y-3 border-s">
                  {navItem?.categories?.map((cat) => (
                    <div key={cat?.name} className="mb-4">
                      <button
                        onClick={() =>
                          setActiveCatMenu(
                            activeCatMenu === cat?.name ? null : cat?.name
                          )
                        }
                        className="font-medium mb-2 flex items-center justify-between w-full text-gray-800 hover:text-blue-600 transition-colors duration-200"
                      >
                        {cat?.name}
                        <BsChevronDown
                          className={`transition-transform duration-300 ${
                            activeCatMenu === cat?.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeCatMenu === cat?.name
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="pl-2 space-y-2 border-s">
                          {cat?.subcategories?.map((subcat) => (
                            <li key={subcat?.id}>
                              <Link
                                href={`/fashion_lifestyle/category/${slugify(
                                  navItem?.type_name
                                )}_${cat?.type_id}_${slugify(cat?.name)}_${
                                  cat?.category_id
                                }_${slugify(subcat?.name)}_${subcat?.id}`}
                                onClick={() => onClose()}
                                className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 block py-1"
                              >
                                {subcat?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
            <BsPerson className="text-lg" />
            <span>Account</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-200">
            <IoMdHeartEmpty className="text-lg" />
            <span>Wishlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarItems;
