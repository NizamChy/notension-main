"use client";

import React from "react";
import { ITEM_CARDS } from "./itemCards";
import { ITEM_GRID_CLASS } from "./storeModules";
import { useStoreData } from "./useStoreData";
import { SectionTitle } from "@/components/shared/UI/UI";

// Which store-data list each custom type shows, and its heading.
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

  const items = useStoreData(moduleName)[stateKey] || [];

  // The store layout shows a Loader until the store has loaded, so the lists
  // are final here. (The old itemsByStore.isLoading flag was never true.)
  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <SectionTitle title={title} subtitle={subtitle} />

      <div className={ITEM_GRID_CLASS}>
        {items.map((item) => (
          <ItemCard key={item?._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CustomTypeItems;
