"use client";

import NavRow from "./NavRow";
import React, { useState } from "react";
import navItems from "../../../../../public/data/navItems.json";
import { useCategoryItem } from "../../hooks/fetchData/useCategoryItem";

const CategoryNav = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [itemsByBrand, setItemsByBrand] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { brands } = useCategoryItem();
  // const { brands, navItems, isLoading } = useCategoryItem();

  // if (isLoading) {
  //   return (
  //     <div className="fixed z-20 bg-white w-full">
  //       <div className="relative hidden lg:flex gap-5 justify-center items-center border-b h-10 animate-pulse">
  //         {[...Array(6)].map((_, i) => (
  //           <div
  //             key={i}
  //             className="min-h-8 border w-24 bg-gray-100 animate-pulse"
  //           />
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  // if (!navItems) {
  //   return (
  //     <div className="fixed z-20 bg-white w-full pt-0.5">
  //       <div className="relative hidden lg:flex justify-center items-center border-b h-12">
  //         <p className="text-red-600">Something went wrong!</p>
  //       </div>
  //     </div>
  //   );
  // }

  const firstRowItems = navItems.slice(0, 7);
  // const firstRowItems = navItems.slice(0, 6);
  // const secondRowItems = navItems.slice(6, 13);

  return (
    <div className="lg:min-h-10">
      <div className="fixed z-20 bg-white w-full pt-0.5">
        <div className="relative hidden lg:flex justify-center items-center border-b">
          <NavRow
            navItems={firstRowItems}
            brands={brands}
            itemsByBrand={itemsByBrand}
            setItemsByBrand={setItemsByBrand}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />
        </div>

        {/* <div className="relative hidden lg:flex justify-center items-center border-b">
          <NavRow
            navItems={secondRowItems}
            brands={brands}
            itemsByBrand={itemsByBrand}
            setItemsByBrand={setItemsByBrand}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />
        </div> */}
      </div>
    </div>
  );
};

export default CategoryNav;
