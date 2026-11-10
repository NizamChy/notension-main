"use client";

import React from "react";
import { useSelector } from "react-redux";
import { ITEM_CARDS } from "./itemCards";
import ItemCardSkeleton from "./ItemCardSkeleton";

// Which `itemsByStore` list each custom type shows, and its heading.
export const CUSTOM_TYPE_SECTIONS = {
  specialOffer: { stateKey: "specialOfferItem", title: "Special Offer" },
  dealOfTheDay: { stateKey: "dealOfTheDay", title: "Deal of The Day" },
  popularItem: { stateKey: "popularItem", title: "Popular Items" },
};

const GRID_CLASS =
  "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center";

const CustomTypeItems = ({ moduleName, section }) => {
  const { stateKey, title } = CUSTOM_TYPE_SECTIONS[section];
  const ItemCard = ITEM_CARDS[moduleName];

  const items = useSelector((state) => state.itemsByStore[stateKey]) || [];
  const isLoading = useSelector((state) => state.itemsByStore.isLoading);

  return (
    <div>
      {isLoading && (
        <div className={`${GRID_CLASS} w-full`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton moduleName={moduleName} key={index} />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <>
          <p className="text-lg md:text-2xl lg:text-3xl font-medium pb-2 md:pb-4">
            {title}
          </p>
          <div className={GRID_CLASS}>
            {items.map((item) => (
              <ItemCard key={item?._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomTypeItems;
