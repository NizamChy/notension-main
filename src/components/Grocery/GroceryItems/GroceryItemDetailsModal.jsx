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
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const GroceryItemDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

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

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
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

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.productInfoTable,
      product_title_eng: item?.product_title_eng,
      product_title_beng: item?.product_title_beng,
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    removeFromfavoriteItems(favouriteInfo, merchantType);
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

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.productInfoTable, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-screen-md m-4"
    >
      <div className="space-y-3">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-secondary">
          Product Details
        </h2>

        <div className="md:flex">
          <div className="md:w-1/3">
            <Image
              src={
                item?.app_image
                  ? `${GROCERY_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.product_title_eng || "Product image"}
              width={240}
              height={240}
              className="w-full md:w-64"
            />
          </div>

          <div className="space-y-1 md:w-2/3 p-4 relative">
            <div className="flex justify-between">
              <h5 className="text-sm md:text-xl font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>

              {item?.less > 0 && (
                <p className="absolute -top-4 right-0 text-sm text-white bg-primaryGrocery px-4 py-0.5 rounded-tl-lg rounded-br-lg">
                  {item?.less}% off
                </p>
              )}
            </div>

            <p className="text-sm text-mediumGray font-medium">
              {item?.pack_size}
            </p>

            <div className="flex gap-5">
              <p className="text-sm md:text-lg font-medium flex items-center text-primaryGrocery">
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

            <div className="flex w-full justify-center gap-5 items-center pt-2">
              <div className="w-2/3 md:w-1/2">
                {currentQuantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2 px-1 md:px-4 bg-primaryGrocery text-white font-medium rounded-lg text-sm hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="w-full bg-primaryGrocery rounded-lg flex items-center justify-between"
                  >
                    <button
                      onClick={(e) => handleDecrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-blue-600 focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={(e) => handleIncrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-blue-600 focus:outline-none transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div className="w-1/3 md:w-1/2">
                {!isFavoriteAdded && (
                  <button onClick={handleAddToFavorite}>
                    <MdOutlineFavoriteBorder className="size-7 p-1 text-xl text-primaryGrocery rounded-full" />
                  </button>
                )}

                {isFavoriteAdded && (
                  <button onClick={handleRemoveFromFavorite}>
                    <FaHeart className="size-7 p-1 text-xl text-primaryGrocery rounded-full" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};

export default GroceryItemDetailsModal;
