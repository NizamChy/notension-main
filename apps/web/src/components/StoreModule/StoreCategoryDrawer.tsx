"use client";

import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import Drawer from "@/components/shared/Drawer/Drawer";
import { NAV_ICON_BUTTON } from "@/components/shared/Navbar/navStyles";
import { StoreCategoryList } from "./StoreCategorySidebar";
import { useStoreData, type StoreModuleName } from "./useStoreData";

type Props = { moduleName: StoreModuleName };

// Navbar button + drawer with the store's categories, below lg (lg+ has
// the fixed sidebar).
const StoreCategoryDrawer = ({ moduleName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { store } = useStoreData(moduleName);

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
        // useStoreData keeps the store as a loose record; shop_name is a string.
        subtitle={store?.shop_name as string | undefined}
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
