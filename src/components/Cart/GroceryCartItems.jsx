"use client";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const GroceryCartItems = () => {
  const { incrementQty, decrementQty, removeFromCart } = useGroceryItems();

  const groceryItems = useSelector((state) => state.cart.groceryItems);

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
      <ul className="space-y-4">
        {groceryItems?.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between gap-4 border-b pb-4"
          >
            <div className="flex items-start gap-4">
              <Image
                src={
                  item.app_image
                    ? `${GROCERY_ITEMS_IMAGES}/${item.app_image}`
                    : "/png/dummyImage.png"
                }
                alt="food image"
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />

              <div>
                <p className="text-base font-semibold">
                  {item?.product_title_eng}
                </p>
                <div className="flex gap-10">
                  <p className="flex items-center text-primaryGrocery text-sm font-medium mt-1">
                    <TbCurrencyTaka className="text-lg" />
                    {item?.sale_price} x {item.quantity}
                  </p>

                  <p className="flex items-center text-primaryGrocery text-sm font-medium mt-1">
                    <TbCurrencyTaka className="text-lg" />
                    {item?.sale_price * item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    disabled={item.quantity === 1}
                    onClick={(e) => handleDecrement(e, item._id)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={(e) => handleIncrement(e, item._id)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => handleRemoveFromCart(e, item._id)}
              className="text-xl text-gray-600 hover:text-red-600"
            >
              <MdDeleteForever />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GroceryCartItems;
