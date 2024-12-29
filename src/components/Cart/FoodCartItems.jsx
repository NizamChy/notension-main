"use client";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { handleCartAction } from "@/redux/cartReducer";
import Image from "next/image";
import React from "react";
import { MdDeleteForever } from "react-icons/md";
import { TbCurrencyTaka } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

const FoodCartItems = () => {
  const dispatch = useDispatch();
  const foodItems = useSelector((state) => state.cart.foodItems);

  return (
    <>
      <ul className="space-y-4">
        {foodItems?.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between gap-4 border-b pb-4"
          >
            <div className="flex items-start gap-4">
              <Image
                src={
                  item.app_image
                    ? `${FOOD_ITEMS_IMAGES}/${item.app_image}`
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
                  <p className="flex items-center text-primary text-sm font-medium mt-1">
                    <TbCurrencyTaka className="text-lg" />
                    {item?.sale_price} x {item.quantity}
                  </p>

                  <p className="flex items-center text-primary text-sm font-medium mt-1">
                    <TbCurrencyTaka className="text-lg" />
                    {item?.sale_price * item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      dispatch(
                        handleCartAction({
                          type: "DECREMENT_QUANTITY_FOOD",
                          data: { _id: item._id },
                        })
                      )
                    }
                    className="px-2 py-1 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        handleCartAction({
                          type: "INCREMENT_QUANTITY_FOOD",
                          data: { _id: item._id },
                        })
                      )
                    }
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                dispatch(
                  handleCartAction({
                    type: "REMOVE_ITEM_FOOD",
                    data: { _id: item._id },
                  })
                )
              }
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

export default FoodCartItems;
