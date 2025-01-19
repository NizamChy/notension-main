"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const ItemDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useMedicineItems();
  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  let merchantType = 1;
  let isExists = null;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng,
      item_title_beng: item?.item_title_beng,
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
    isExists = isAddedToFavouriteItems(item?.medStoreProductInfo, merchantType);

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
          <div className="w-full md:w-1/3">
            <Image
              src={
                item?.app_image
                  ? `${MEDICINE_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.item_title_eng || "Product image"}
              width={240}
              height={240}
              className="w-full md:w-64 rounded-lg"
            />
          </div>

          <div className="space-y-1 md:w-2/3 p-4 relative">
            <div className="flex justify-between">
              <h5 className="text-base md:text-xl font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.item_title_eng}
              </h5>

              {item?.less > 0 && (
                <p className="absolute -top-4 right-0 text-sm text-white bg-primaryMedicine px-4 py-0.5 rounded-tl-lg rounded-br-lg">
                  {item?.less}% off
                </p>
              )}

              <p className="text-sm text-mediumGray">{item?.strength}</p>
            </div>
            <p className="text-xs md:text-base text-secondaryMedicine">
              {item?.generic_name}
            </p>
            <p className="text-xs md:text-base text-secondary">
              {item?.company_name}
            </p>
            <p className="text-xs md:text-base text-deepGray font-medium">
              {item?.pack_size}
            </p>

            <div className="flex gap-5">
              <p className="text-sm md:text-lg font-medium flex items-center text-primaryMedicine">
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
                    className="w-full py-2 px-4 bg-primaryMedicine text-white font-medium rounded-lg text-sm hover:bg-secondaryMedicine focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-200"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="w-full bg-primaryMedicine rounded-lg flex items-center justify-between"
                  >
                    <button
                      onClick={(e) => handleDecrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={(e) => handleIncrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div className="w-1/3 md:w-1/2">
                {!isFavoriteAdded && (
                  <button onClick={handleAddToFavorite}>
                    <MdOutlineFavoriteBorder className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
                  </button>
                )}

                {isFavoriteAdded && (
                  <button onClick={handleRemoveFromFavorite}>
                    <FaHeart className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
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

export default ItemDetailsModal;
