"use client";

import Image from "next/image";
import React, { useState } from "react";
import { NAV_ITEMS } from "@/utils/constants";
import { BsChevronDown } from "react-icons/bs";

const CategoryNavBar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="fixed z-20 bg-white w-full pt-0.5">
      <div className="relative hidden lg:flex justify-center items-center border-b">
        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-6 font-medium h-full">
          {Object.keys(NAV_ITEMS)?.map((category) => (
            <li
              key={category}
              className="h-full flex items-center group"
              onMouseEnter={() => setActiveMenu(category)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center py-2 cursor-pointer hover:text-primary px-2">
                {category}
                <BsChevronDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
              </div>

              {/* Mega Dropdown Menu - Now properly sized and centered */}
              {activeMenu === category && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[800px] bg-white shadow-lg z-50 border rounded-b-lg">
                  <div className="p-6 grid grid-cols-4 gap-6">
                    {/* Categories Column */}
                    <div className="col-span-3 grid grid-cols-3 gap-6">
                      {NAV_ITEMS[category]?.categories?.map((cat) => (
                        <div key={cat.name}>
                          <h3 className="font-bold text-base mb-3">
                            {cat?.name}
                          </h3>
                          <ul className="space-y-2">
                            {cat?.subcategories?.map((subcat) => (
                              <li key={subcat}>
                                <a
                                  href={`/${category.toLowerCase()}/${subcat
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                                  className="text-sm hover:text-primary hover:ps-2 transition-all duration-300"
                                >
                                  {subcat}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Featured Column */}
                    <div className="border-l pl-6">
                      <h3 className="font-bold text-base mb-3">Featured</h3>
                      <div className="group">
                        <div className="aspect-[3/4] relative overflow-hidden rounded-lg mb-2">
                          {NAV_ITEMS[category]?.featured?.image && (
                            <Image
                              src={NAV_ITEMS[category]?.featured?.image}
                              alt={NAV_ITEMS[category]?.featured?.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <p className="text-sm font-medium">
                          {NAV_ITEMS[category]?.featured?.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryNavBar;
