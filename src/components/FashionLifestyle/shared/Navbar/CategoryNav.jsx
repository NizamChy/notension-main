"use client";

import NavRow from "./NavRow";
import React, { useState } from "react";
import { useNavItems } from "../../hooks/useNavItems";

const CategoryNav = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [itemsByBrand, setItemsByBrand] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { navItems: firstRowItems, brands } = useNavItems();
  // const firstRowItems = navItems.slice(0, 6);
  // const secondRowItems = navItems.slice(6, 13);

  return (
    <div className="lg:min-h-10 hidden lg:block">
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
