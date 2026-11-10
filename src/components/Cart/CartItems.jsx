"use client";

import React from "react";
import { lineTotal } from "@/utils/price";
import Image from "next/image";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { CART_MODULES } from "./cartModules";

// Render with key={moduleName} so the per-module hooks never change between
// renders of the same instance.
const CartItems = ({ moduleName }) => {
  const { itemsKey, visitedStoreKey, imageBaseUrl, titleField, textClass, useItems } =
    CART_MODULES[moduleName];
  const { incrementQty, decrementQty, removeFromCart } = useItems();

  const items = useSelector((state) => state.cart[itemsKey]);

  const visitedStore = useSelector(
    (state) => state.dashboard[visitedStoreKey]
  );

  const handleIncrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    incrementQty(itemId);
  };

  const handleDecrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    decrementQty(itemId);
  };

  const handleRemoveFromCart = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    removeFromCart(itemId);
  };

  return (
    <>
      {items?.length > 0 && visitedStore?.delivery_notice && (
        <p className="text-deepGray font-semibold bg-yellow-400 text-center text-sm p-2 rounded-md mb-2">
          {visitedStore?.delivery_notice}
        </p>
      )}

      <ul className="space-y-4">
        {items?.map((item) => (
          <li
            key={item?._id}
            className="flex items-center justify-between gap-4 border-b pb-4"
          >
            <div className="flex items-start gap-4">
              <Image
                src={
                  item?.app_image
                    ? `${imageBaseUrl}/${item?.app_image}`
                    : "/png/dummyImage.png"
                }
                alt={item?.[titleField] || "item image"}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />

              <div>
                <p className="text-xs md:text-base font-semibold">
                  {item?.[titleField]}
                </p>
                {/* Unit price x quantity, then the line total. */}
                <p className="mt-1 flex items-center text-xs md:text-sm text-gray-500 whitespace-nowrap">
                  <TbCurrencyTaka className="shrink-0" />
                  {item?.sale_price} × {item?.quantity}
                </p>
                <p className={`flex items-center ${textClass} text-sm md:text-base font-semibold`}>
                  <TbCurrencyTaka className="shrink-0" />
                  {lineTotal(item).toFixed(2)}
                </p>

                <div className="mt-2 inline-flex items-center rounded-md border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={item?.quantity === 1}
                    onClick={(e) => handleDecrement(e, item?._id)}
                    className="h-7 w-7 flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                  >
                    −
                  </button>
                  <span className="h-7 min-w-8 px-1 flex items-center justify-center border-x border-gray-200 text-sm font-medium">
                    {item?.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={(e) => handleIncrement(e, item?._id)}
                    className="h-7 w-7 flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Remove from cart"
              onClick={(e) => handleRemoveFromCart(e, item?._id)}
              className="self-start p-1 text-xl text-gray-500 hover:text-red-600"
            >
              <MdDeleteForever />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CartItems;
