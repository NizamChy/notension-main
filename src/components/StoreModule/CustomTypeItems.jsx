"use client";

import React from "react";
import { useSelector } from "react-redux";
import { ITEM_CARDS } from "./itemCards";
import ItemCardSkeleton from "./ItemCardSkeleton";
import { ITEM_GRID_CLASS, SECTION_TITLE_CLASS } from "./storeModules";

// Which `itemsByStore` list each custom type shows, and its heading.
export const CUSTOM_TYPE_SECTIONS = {
  specialOffer: { stateKey: "specialOfferItem", title: "Special Offer" },
  dealOfTheDay: { stateKey: "dealOfTheDay", title: "Deal of The Day" },
  popularItem: { stateKey: "popularItem", title: "Popular Items" },
};

const CustomTypeItems = ({ moduleName, section }) => {
  const { stateKey, title } = CUSTOM_TYPE_SECTIONS[section];
  const ItemCard = ITEM_CARDS[moduleName];

  const items = useSelector((state) => state.itemsByStore[stateKey]) || [];
  const isLoading = useSelector((state) => state.itemsByStore.isLoading);

  if (!isLoading && items.length === 0) return null;

  return (
    <section>
      <h2 className={SECTION_TITLE_CLASS}>{title}</h2>

      {isLoading ? (
        <div className={ITEM_GRID_CLASS}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className={ITEM_GRID_CLASS}>
          {items.map((item) => (
            <ItemCard key={item?._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CustomTypeItems;
