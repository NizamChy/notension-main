"use client";

import React from "react";
import { useSelector } from "react-redux";
import { HiOutlineFire } from "react-icons/hi2";
import { useFood } from "@/hooks/fetch-data/useFood";
import { EmptyState } from "@/components/shared/UI/UI";
import MenuSection, { MenuSkeleton } from "./MenuSection";
import { POPULAR_SECTION } from "@/components/Food/CategorySidebar/useMenuNav";

const itemCount = (n) => `${n} item${n === 1 ? "" : "s"}`;

// Restaurant home: popular dishes, then the whole menu section by section.
const FoodItemsHome = () => {
  const { progressing } = useFood();
  const { popularItem, productInfoByShop } = useSelector(
    (state) => state.itemsByStore
  );

  const sections = (productInfoByShop || []).filter(
    (section) => section?.itemsInfo?.length > 0
  );

  if (progressing) {
    return (
      <div className="space-y-8">
        <MenuSkeleton />
        <MenuSkeleton />
      </div>
    );
  }

  if (!popularItem?.length && !sections.length) {
    return (
      <EmptyState
        title="Menu coming soon"
        text="This restaurant hasn't added any dishes yet. Please check back later."
      />
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {popularItem?.length > 0 && (
        <MenuSection
          sectionId={POPULAR_SECTION}
          title={
            <span className="inline-flex items-center gap-2">
              <HiOutlineFire className="text-[#EB5C2F]" aria-hidden="true" />
              Popular
            </span>
          }
          subtitle="Most ordered right now"
          items={popularItem}
        />
      )}

      {sections.map((section) => (
        <MenuSection
          key={section?._id}
          sectionId={section?._id}
          title={section?.catagory}
          subtitle={itemCount(section.itemsInfo.length)}
          items={section.itemsInfo}
        />
      ))}
    </div>
  );
};

export default FoodItemsHome;
