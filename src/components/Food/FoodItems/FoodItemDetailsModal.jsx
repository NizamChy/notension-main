"use client";

import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const FoodItemDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useFoodItems();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

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

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-screen-md m-4"
    >
      <div className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-secondary">
          Details
        </h2>

        <div className="md:flex gap-5">
          <div className="md:w-1/3">
            <Image
              src={
                item?.app_image
                  ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.product_title_eng || "Product image"}
              width={500}
              height={500}
              className="w-full md:w-64 rounded-lg"
            />
          </div>

          <div className="space-y-1 md:w-2/3 p-4 relative">
            <div className="flex justify-between">
              <h5 className="text-base md:text-xl font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>

              {item?.less > 0 && (
                <p className="flex items-center absolute -top-4 right-0 text-sm text-white bg-primaryFood px-4 py-0.5 rounded-tl-lg rounded-br-lg">
                  {item?.less}
                  {item?.less_type === "Percent" ? "%" : "৳"} OFF
                </p>
              )}
            </div>

            <p className="text-sm md:text-base text-lightGray font-medium">
              {item?.pack_size}
            </p>

            <div className="flex gap-5">
              <p className="text-sm md:text-lg font-medium flex items-center text-primaryFood">
                <TbCurrencyTaka className="md:text-2xl" />
                {item?.sale_price}
              </p>

              {item?.sale_price < item?.max_retail_price ? (
                <>
                  <p className="text-sm md:text-base flex items-center text-lightGray line-through">
                    <TbCurrencyTaka className="md:text-lg" />
                    {item?.max_retail_price}
                  </p>
                </>
              ) : null}
            </div>

            <div className="flex w-full justify-start gap-5 items-center pt-2">
              <div className="w-1/2">
                {currentQuantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2 px-4 bg-primaryFood text-white font-medium rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="w-full bg-primaryFood rounded-lg flex items-center justify-between"
                  >
                    <button
                      onClick={(e) => handleDecrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-red-600 focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={(e) => handleIncrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-red-600 focus:outline-none transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default FoodItemDetailsModal;
