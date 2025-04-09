"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { IMAGE_URL } from "@/api-endpoints/secret";
import { useFavouriteStore } from "@/hooks/fetch-data/favorite-shop";

const ShopInfoCard = ({ shop, onClick, type, isFavorite = false }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList, removeFromfavoriteList } =
    useFavouriteStore();

  const { userInfo } = useSelector((state) => state.user);

  let merchantType = 0;
  let isExists = null;

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userInfo?._id) {
      return toast.info("Login to add favourite!");
    }

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

    isExists = isAddedToFavouriteList(shop?._id, merchantType);
    setIsFavoriteAdded(isExists);
  }, [shop, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <div
      onClick={onClick}
      className="group card bg-white shadow-md cursor-pointer rounded-lg mb-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Skeleton loader that shows while image is loading */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse w-full h-full">
            <div className="h-full flex justify-center items-center">
              <Image
                src="/gif/loading.gif"
                alt="loading.gif"
                width={60}
                height={60}
              />
            </div>
          </div>
        )}

        <Image
          src={`${IMAGE_URL}/${type}-store-docs/${shop?.shop_banner_app}`}
          alt={`${shop?.shop_name} banner`}
          width={500}
          height={300}
          // className="w-full h-44 md:h-60 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          className={`w-full h-44 md:h-60 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsImageLoading(false)}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {!shop?.is_closed && !isFavoriteAdded && !isFavorite && (
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
          <p className="bg-yellow-300 absolute top-3 right-3 rounded-lg px-2 py-0.5 text-sm font-semibold opacity-75">
            {shop?.delivery_notice}
          </p>
        )}

        {shop?.is_closed && (
          <p className="bg-red-400 absolute bottom-14 right-5 rounded-lg px-2 py-0.5 text-lg font-semibold">
            Closed!
          </p>
        )}
      </div>

      <div className="p-4">
        <h2 className="md:text-xl font-semibold mb-2">{shop?.shop_name}</h2>
        <p className="text-sm md:text-base text-gray-700 mb-2 flex gap-1 lg:min-h-12">
          <span className="text-blue-600 mt-1">
            <FaLocationDot />
          </span>
          <span title={shop?.shop_address} className="line-clamp-2">
            {shop?.shop_address}
          </span>
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
