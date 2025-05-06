"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const FoodItemDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);

  const { currentItemDetails: item } = useSelector((state) => state.userChoice);
  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useFoodItems();

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(item);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await incrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await decrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  return (
    <>
      {item && (
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 px-6 pt-6">
              Product Details
            </h2>

            <div className="md:flex p-6">
              {/* Product Image Section */}
              <div className="md:w-2/5 lg:w-1/3 flex flex-col items-center">
                <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  <Image
                    src={
                      item?.app_image
                        ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
                        : "/png/dummyImage.png"
                    }
                    alt={item?.product_title_eng || "Product image"}
                    width={320}
                    height={320}
                    className="object-contain w-full h-full"
                    priority
                  />

                  {item?.less > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {item?.less} tk OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="md:w-3/5 lg:w-2/3 md:pl-8">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {item?.product_title_eng}
                  </h1>
                  <p className="text-gray-600 text-sm mb-2">
                    {item?.product_title_beng}
                  </p>
                  <p className="text-gray-500 text-sm">{item?.pack_size}</p>
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-gray-900 flex items-center">
                      <TbCurrencyTaka className="mr-1" />
                      {item?.sale_price}
                    </span>
                    {item?.sale_price < item?.max_retail_price && (
                      <span className="ml-3 text-gray-500 line-through flex items-center">
                        <TbCurrencyTaka className="mr-1" />
                        {item?.max_retail_price}
                      </span>
                    )}
                  </div>
                  {item?.less > 0 && (
                    <p className="text-green-600 text-sm">
                      You save <TbCurrencyTaka className="inline" />
                      {item?.max_retail_price - item?.sale_price} ({item?.less}
                      tk off)
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-6">
                  {currentQuantity === 0 ? (
                    <button
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium text-white ${
                        isLoading
                          ? "bg-blue-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      } transition-colors duration-200 flex items-center justify-center`}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={(e) => handleDecrement(e, item._id)}
                        disabled={isLoading}
                        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-lg transition-colors duration-200"
                      >
                        -
                      </button>
                      <span className="py-2 px-6 bg-white text-gray-800 font-medium text-center">
                        {currentQuantity}
                      </span>
                      <button
                        onClick={(e) => handleIncrement(e, item._id)}
                        disabled={isLoading}
                        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-lg transition-colors duration-200"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Product Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Availability:</span>{" "}
                      {/* {item?.is_available ? ( */}
                      {item ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-red-600">Not Available</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Unit:</span>{" "}
                      {item?.unit_symbol}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodItemDetails;
