"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const MedicineCartItems = () => {
  const { incrementQty, decrementQty, removeFromCart } = useMedicineItems();

  const medicineItems = useSelector((state) => state.cart.medicineItems);

  const handleDecrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    decrementQty(itemId);
  };

  const handleIncrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    incrementQty(itemId);
  };

  const handleRemoveFromCart = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    removeFromCart(itemId);
  };

  return (
    <>
      <ul className="space-y-4">
        {medicineItems?.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between gap-4 border-b pb-4"
          >
            <div className="flex items-start gap-4">
              <Image
                src={
                  item.app_image
                    ? `${MEDICINE_ITEMS_IMAGES}/${item.app_image}`
                    : "/png/dummyImage.png"
                }
                alt="food image"
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />

              <div>
                <p className="text-xs md:text-base font-semibold">
                  {item?.item_title_eng}
                </p>
                <div className="flex gap-2 md:gap-10">
                  <p className="flex items-center text-primaryMedicine text-xs text-nowrap md:text-sm font-medium mt-1">
                    <TbCurrencyTaka className="text-lg" />
                    {item?.sale_price} x {item.quantity}
                  </p>

                  <p className="flex items-center text-primaryMedicine text-xs md:text-sm font-medium mt-1">
                    <TbCurrencyTaka className="text-lg" />

                    {(item?.sale_price * item.quantity).toFixed(2)}
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

export default MedicineCartItems;
