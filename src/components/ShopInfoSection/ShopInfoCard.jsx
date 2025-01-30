"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { IMAGE_URL } from "@/api-endpoints/secret";
import { useFavouriteStore } from "@/hooks/fetch-data/favorite-shop";

const ShopInfoCard = ({ shop, onClick, type, isFavorite = false }) => {
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList, removeFromfavoriteList } =
    useFavouriteStore();

  let merchantType = 0;
  let isExists = null;

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteList(shop, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    removeFromfavoriteList(shop, merchantType);
  };

  useEffect(() => {
    if (type === "grocery") {
      merchantType = 0;
    } else if (type === "medicine") {
      merchantType = 1;
    } else {
      merchantType = 2;
    }

    isExists = isAddedToFavouriteList(shop._id, merchantType);
    setIsFavoriteAdded(isExists);
  }, [shop, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <div
      onClick={onClick}
      className="group card bg-white shadow-md cursor-pointer rounded-lg mb-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={`${IMAGE_URL}/${type}-store-docs/${shop?.shop_banner_app}`}
          alt={`${shop?.shop_name} banner`}
          width={500}
          height={300}
          className="w-full h-60 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
        />

        {!isFavoriteAdded && !isFavorite && (
          <button
            onClick={handleAddToFavorite}
            className="absolute bottom-4 right-3 md:right-4 text-deepGray bg-primaryBg opacity-65 hover:text-primaryFood border hover:border-primaryFood rounded-full hover:bg-white px-1 flex justify-center items-center "
          >
            <FaHeart className="size-7 p-1 text-xl rounded-full text-primaryFood" />
            <span className="text-xs font-medium">Add to Favorite</span>
          </button>
        )}

        {isFavorite && (
          <button
            onClick={handleRemoveFromFavorite}
            className="absolute bottom-4 right-3 md:right-4 text-deepGray bg-primaryBg opacity-65 hover:text-primaryFood border hover:border-primaryFood rounded-full hover:bg-white px-1 flex justify-center items-center "
          >
            <IoTrashOutline className="size-7 p-1 text-xl rounded-full text-primaryFood" />
            <span className="text-xs font-medium">Remove</span>
          </button>
        )}

        {shop?.delivery_notice && (
          <p className="bg-yellow-300 absolute bottom-3 left-3 rounded-lg px-2 py-0.5 text-sm font-semibold opacity-75">
            {shop?.delivery_notice}
          </p>
        )}
      </div>

      <div className="p-4">
        <h2 className="md:text-xl font-semibold mb-2">{shop?.shop_name}</h2>
        <p className="text-sm md:text-base text-gray-700 mb-2 flex gap-1">
          <span className="text-blue-600 mt-1">
            <FaLocationDot />
          </span>
          {shop?.shop_address}
        </p>

        {shop?.distance && (
          <p className="text-xs md:text-base text-gray-500 ps-4">
            Distance: {(shop?.distance / 1000).toFixed(2)} km
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopInfoCard;
