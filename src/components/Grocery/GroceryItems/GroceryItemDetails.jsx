"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { TbCurrencyTaka } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const GroceryItemDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { currentItemDetails: item } = useSelector((state) => state.userChoice);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useGroceryItems();
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  let merchantType = 0;
  let isExists = null;

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(item);
      // toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!loggedinUserInfo?._id) {
      return toast("Please Login first!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    setIsLoading(true);
    try {
      await addToFavouriteItems(item, merchantType);
      setIsFavoriteAdded(true);
      // toast.success("Added to favorites!");
    } catch (error) {
      toast.error("Failed to add to favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.productInfoTable,
      product_title_eng: item?.product_title_eng,
      product_title_beng: item?.product_title_beng,
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    setIsLoading(true);
    try {
      await removeFromfavoriteItems(favouriteInfo, merchantType);
      setIsFavoriteAdded(false);
      // toast.success("Removed from favorites!");
    } catch (error) {
      toast.error("Failed to remove from favorites");
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

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.productInfoTable, merchantType);
    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <>
      {item && (
        <div className="max-w-6xl mx-auto px-4 py-8">
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
                        ? `${GROCERY_ITEMS_IMAGES}/${item?.app_image}`
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
                      {item?.less}% OFF
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
                      {item?.max_retail_price - item?.sale_price} ({item?.less}%
                      off)
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

                  <button
                    onClick={
                      isFavoriteAdded
                        ? handleRemoveFromFavorite
                        : handleAddToFavorite
                    }
                    disabled={isLoading}
                    className={`p-3 rounded-full border ${
                      isFavoriteAdded
                        ? "text-red-500 border-red-500 hover:bg-red-50"
                        : "text-gray-500 border-gray-300 hover:bg-gray-50"
                    } transition-colors duration-200`}
                    aria-label={
                      isFavoriteAdded
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {isFavoriteAdded ? (
                      <FaHeart className="text-xl" />
                    ) : (
                      <MdOutlineFavoriteBorder className="text-xl" />
                    )}
                  </button>
                </div>

                {/* Additional Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Product Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Availability:</span>{" "}
                      {item?.is_available ? (
                        <span className="text-green-600">In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
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

export default GroceryItemDetails;
