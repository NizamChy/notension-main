"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IMAGE_URL } from "@/api-endpoints/env";
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlineTrash,
} from "react-icons/hi2";
import { CARD, CARD_HOVER } from "../shared/UI/UI";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";
import { useFavouriteStore } from "@/hooks/fetch-data/favorite-shop";

const CORNER_BUTTON =
  "absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/90 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-[#FFFFFF]";

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

  const isClosed = !!shop?.is_closed;

  return (
    <>
      {/* Fixed-ratio banner + fixed-height text rows, so every card in a grid
          row is the same height. */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${shop?.shop_name || "store"}`}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.target === event.currentTarget && event.key === "Enter") onClick?.(event);
        }}
        className={`group flex h-full cursor-pointer flex-col overflow-hidden ${CARD} ${CARD_HOVER} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3F8E]/40`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
          {isImageLoading && (
            <div className="absolute inset-0 animate-pulse bg-gray-100" />
          )}

          <Image
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={`${IMAGE_URL}/${type}-store-docs/${shop?.shop_banner_app}`}
            alt={`${shop?.shop_name || "Store"} banner`}
            className={`object-cover transition duration-500 group-hover:scale-[1.04] ${
              isImageLoading ? "opacity-0" : "opacity-100"
            } ${isClosed ? "grayscale-[60%]" : ""}`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />

          {isClosed && <div className="absolute inset-0 bg-black/35" />}

          {/* Badges sit top-left, the favourite button top-right. */}
          {!isClosed && !isFavoriteAdded && !isFavorite && (
            <button
              type="button"
              onClick={handleAddToFavorite}
              aria-label="Add to favourites"
              title="Add to favourites"
              className={`${CORNER_BUTTON} text-[#475467] hover:text-[#D92D20]`}
            >
              <HiOutlineHeart className="text-lg" />
            </button>
          )}

          {!isClosed && isFavoriteAdded && !isFavorite && (
            <span
              role="img"
              aria-label="In your favourites"
              className={`${CORNER_BUTTON} pointer-events-none text-[#D92D20]`}
            >
              <HiHeart className="text-lg" />
            </span>
          )}

          {isFavorite && (
            <button
              type="button"
              onClick={handleRemoveFromFavorite}
              aria-label="Remove from favourites"
              title="Remove from favourites"
              className={`${CORNER_BUTTON} text-[#475467] hover:text-[#D92D20]`}
            >
              <HiOutlineTrash className="text-lg" />
            </button>
          )}

          {(isClosed || shop?.delivery_notice) && (
            <div className="absolute left-2.5 right-14 top-2.5 flex flex-col items-start gap-1.5">
              {isClosed && (
                <span className="rounded-full bg-[#D92D20] px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                  Closed now
                </span>
              )}

              {shop?.delivery_notice && (
                <span
                  title={shop?.delivery_notice}
                  className="max-w-full truncate rounded-full bg-[#FEF0C7] px-2.5 py-0.5 text-xs font-semibold text-[#93370D] shadow-sm"
                >
                  {shop?.delivery_notice}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h2
            title={shop?.shop_name}
            className="truncate text-base font-semibold text-gray-900"
          >
            {shop?.shop_name}
          </h2>
          <p className="mt-1.5 flex min-h-[2.5rem] gap-1.5 text-sm leading-5 text-gray-500">
            <HiOutlineMapPin className="mt-0.5 shrink-0 text-base text-gray-400" />
            <span title={shop?.shop_address} className="line-clamp-2">
              {shop?.shop_address}
            </span>
          </p>

          {shop?.distance != null && (
            <div className="mt-auto pt-3">
              <span className="inline-flex items-center rounded-full bg-[#0C3F8E]/10 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[#0C3F8E] dark:text-[#7FB2FF]">
                {(shop?.distance / 1000).toFixed(2)} km away
              </span>
            </div>
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
