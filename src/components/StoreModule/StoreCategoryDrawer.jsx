"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BiCategory } from "react-icons/bi";
import Drawer from "@/components/shared/Drawer/Drawer";
import { NAV_ICON_BUTTON } from "@/components/shared/Navbar/navStyles";
import { StoreCategoryList } from "./StoreCategorySidebar";

const VISITED_STORE_KEY = {
  grocery: "visitedGroceryStore",
  medicine: "visitedMedicineStore",
};

// Navbar button + drawer with the store's categories, below lg (lg+ has
// the fixed sidebar).
const StoreCategoryDrawer = ({ moduleName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const store = useSelector(
    (state) => state.dashboard[VISITED_STORE_KEY[moduleName]],
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Browse categories"
        className={`${NAV_ICON_BUTTON} -ml-2 text-xl`}
      >
        <BiCategory />
      </button>

      <Drawer
        side="left"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Categories"
        subtitle={store?.shop_name}
        widthClass="w-[86%] max-w-[360px]"
        bodyClass="px-3 py-3"
      >
        <StoreCategoryList
          moduleName={moduleName}
          onNavigate={() => setIsOpen(false)}
        />
      </Drawer>
    </div>
  );
};

export default StoreCategoryDrawer;
