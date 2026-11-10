"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { IMAGE_URL } from "@/api-endpoints/env";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";
import { useFavouriteStore } from "@/hooks/fetch-data/favorite-shop";

const ShopInfoCard = ({ shop, onClick, type, isFavorite = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList, removeFromfavoriteList } =
    useFavouriteStore();

  const { userInfo } = useSelector((state) => state.user);

  let merchantType = 0;
  let isExists = null;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userInfo?._id) {
      return openModal();
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
    <>
      {/* Fixed-ratio banner + fixed-height text rows, so every card in a grid
          row is the same height. */}
      <div
        onClick={onClick}
        className="group h-full flex flex-col bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <div className="relative w-full aspect-[5/3] overflow-hidden bg-gray-100">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          <Image
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={`${IMAGE_URL}/${type}-store-docs/${shop?.shop_banner_app}`}
            alt={`${shop?.shop_name} banner`}
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />

          {!shop?.is_closed && !isFavoriteAdded && !isFavorite && (
            <button
              onClick={handleAddToFavorite}
              className="absolute bottom-3 right-3 h-8 ps-1.5 pe-3 flex items-center gap-1 rounded-full bg-white/90 hover:bg-white text-deepGray shadow-sm"
            >
              <FaHeart className="text-primaryFood text-sm mx-1" />
              <span className="text-xs font-medium">Add to Favorite</span>
            </button>
          )}

          {isFavorite && (
            <button
              onClick={handleRemoveFromFavorite}
              className="absolute bottom-3 right-3 h-8 ps-1.5 pe-3 flex items-center gap-1 rounded-full bg-white/90 hover:bg-white text-deepGray shadow-sm"
            >
              <IoTrashOutline className="text-primaryFood text-base mx-1" />
              <span className="text-xs font-medium">Remove</span>
            </button>
          )}

          {shop?.delivery_notice && (
            <p className="absolute top-3 right-3 max-w-[60%] truncate bg-yellow-300/95 rounded-md px-2 py-0.5 text-xs font-semibold text-gray-900">
              {shop?.delivery_notice}
            </p>
          )}

          {shop?.is_closed && (
            <p className="absolute top-3 left-3 bg-red-500 text-white rounded-md px-2 py-0.5 text-xs font-semibold shadow">
              Closed
            </p>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          <h2
            title={shop?.shop_name}
            className="text-base md:text-lg font-semibold text-gray-900 truncate"
          >
            {shop?.shop_name}
          </h2>
          <p className="mt-1 text-sm text-gray-600 flex gap-1.5 min-h-[2.5rem]">
            <FaLocationDot className="shrink-0 mt-0.5 text-blue-600" />
            <span title={shop?.shop_address} className="line-clamp-2">
              {shop?.shop_address}
            </span>
          </p>

          {shop?.distance != null && (
            <p className="mt-auto pt-2 text-xs md:text-sm text-gray-500">
              Distance: {(shop?.distance / 1000).toFixed(2)} km
            </p>
          )}
        </div>
      </div>

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails
          onClose={closeModal}
          type="favourite"
          handleAddToFavorite={handleAddToFavorite}
        />
      </CommonModal>
    </>
  );
};

export default ShopInfoCard;
