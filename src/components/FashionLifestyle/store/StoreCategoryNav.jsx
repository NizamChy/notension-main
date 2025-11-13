"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import StoreNavRow from "../shared/Navbar/StoreNavRow";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import { generateStoreNavItems } from "../utils/generateStoreNavItems";

const StoreCategoryNav = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const params = useParams();
  const storeId = params?.shopSlugId?.split("_")[1];

  const { useTypeByStoreId, useCategoryByStoreId, useSubCategoryByStoreId } =
    useStoreItems();

  const { data: allTypesByStore } = useTypeByStoreId(storeId);
  const { data: allCategoriesByStore } = useCategoryByStoreId(storeId);
  const { data: allSubCategoriesByStore } = useSubCategoryByStoreId(storeId);

  const storeNavItems =
    allTypesByStore && allCategoriesByStore && allSubCategoriesByStore
      ? generateStoreNavItems(
          allTypesByStore,
          allCategoriesByStore,
          allSubCategoriesByStore
        )
      : null;

  return (
    <div className="lg:min-h-10">
      <div className="fixed z-20 bg-white w-full pt-0.5">
        <div className="relative hidden lg:flex justify-center items-center border-b">
          <StoreNavRow
            navItems={storeNavItems}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreCategoryNav;
