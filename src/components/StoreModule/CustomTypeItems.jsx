"use client";

import React from "react";
import { useSelector } from "react-redux";
import { ITEM_CARDS } from "./itemCards";
import ItemCardSkeleton from "./ItemCardSkeleton";
import { ITEM_GRID_CLASS } from "./storeModules";
import { SectionTitle } from "@/components/shared/UI/UI";

// Which `itemsByStore` list each custom type shows, and its heading.
export const CUSTOM_TYPE_SECTIONS = {
  specialOffer: {
    stateKey: "specialOfferItem",
    title: "Special Offer",
    subtitle: "Limited-time prices on everyday picks",
  },
  dealOfTheDay: {
    stateKey: "dealOfTheDay",
    title: "Deal of The Day",
    subtitle: "Today's best savings, while stocks last",
  },
  popularItem: {
    stateKey: "popularItem",
    title: "Popular Items",
    subtitle: "What other shoppers are buying",
  },
};

const CustomTypeItems = ({ moduleName, section }) => {
  const { stateKey, title, subtitle } = CUSTOM_TYPE_SECTIONS[section];
  const ItemCard = ITEM_CARDS[moduleName];

  const items = useSelector((state) => state.itemsByStore[stateKey]) || [];
  const isLoading = useSelector((state) => state.itemsByStore.isLoading);

  if (!isLoading && items.length === 0) return null;

  return (
    <section aria-label={title}>
      <SectionTitle title={title} subtitle={subtitle} />

      <div className={ITEM_GRID_CLASS}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ItemCardSkeleton key={index} />
            ))
          : items.map((item) => <ItemCard key={item?._id} item={item} />)}
      </div>
    </section>
  );
};

export default CustomTypeItems;
