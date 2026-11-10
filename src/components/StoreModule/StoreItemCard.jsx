"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdOutlineFavoriteBorder } from "react-icons/md";

// Accent classes per module, kept as full strings for the Tailwind scanner.
const THEMES = {
  food: {
    text: "text-primaryFood",
    bg: "bg-primaryFood",
    hoverBg: "hover:bg-red-600",
    ring: "focus-visible:ring-red-300",
  },
  grocery: {
    text: "text-primaryGrocery",
    bg: "bg-primaryGrocery",
    hoverBg: "hover:bg-blue-600",
    ring: "focus-visible:ring-blue-300",
  },
  medicine: {
    text: "text-primaryMedicine",
    bg: "bg-primaryMedicine",
    hoverBg: "hover:bg-secondaryMedicine",
    ring: "focus-visible:ring-green-300",
  },
};

const stop = (handler) => (event) => {
  event.preventDefault();
  event.stopPropagation();
  handler?.(event);
};

// Presentational product card shared by the food, grocery and medicine lists.
// It fills its grid cell (h-full): square image, title clamped to two lines,
// one-line subtitle, then the price row and button pinned to the bottom
// (mt-auto) — so all cards in a grid row are the same height and their
// prices / buttons line up.
const StoreItemCard = ({
  moduleName,
  imageSrc,
  title,
  subtitle,
  salePrice,
  mrp,
  discountLabel,
  isFavorite,
  onClick,
  onFavoriteToggle,
  showCartControls = true,
  quantity = 0,
  onAddToCart,
  onIncrement,
  onDecrement,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const theme = THEMES[moduleName];

  return (
    <div
      onClick={onClick}
      className="group h-full flex flex-col cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <Image
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 50vw"
          src={imageSrc}
          alt={title || "Product image"}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {discountLabel && (
          <span
            className={`absolute top-2 left-2 ${theme.bg} text-white text-[11px] md:text-xs font-semibold px-2 py-0.5 rounded-md`}
          >
            {discountLabel}
          </span>
        )}

        {onFavoriteToggle && (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
            onClick={stop(onFavoriteToggle)}
            className={`absolute top-2 right-2 size-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center ${theme.text} hover:bg-white`}
          >
            {isFavorite ? (
              <FaHeart className="text-base" />
            ) : (
              <MdOutlineFavoriteBorder className="text-lg" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1 p-2.5 md:p-3">
        <h3
          title={title}
          className="text-sm md:text-[15px] font-semibold leading-snug text-deepGray line-clamp-2"
        >
          {title}
        </h3>
        <p className="mt-0.5 text-xs md:text-sm text-mediumGray truncate min-h-[1.25rem]">
          {subtitle}
        </p>

        <div className="mt-auto pt-2 flex items-center flex-wrap gap-x-2 min-h-[1.75rem]">
          {salePrice != null && salePrice !== "" && (
            <span
              className={`flex items-center text-base md:text-lg font-semibold ${theme.text}`}
            >
              <TbCurrencyTaka className="text-lg md:text-xl" />
              {salePrice}
            </span>
          )}
          {Number(salePrice) < Number(mrp) && (
            <span className="flex items-center text-xs md:text-sm text-lightGray line-through">
              <TbCurrencyTaka />
              {mrp}
            </span>
          )}
        </div>

        {showCartControls && (
          <div className="mt-2.5" onClick={stop()}>
            {quantity === 0 ? (
              <button
                type="button"
                onClick={stop(onAddToCart)}
                className={`w-full h-9 md:h-10 ${theme.bg} ${theme.hoverBg} text-white font-medium rounded-lg text-xs md:text-sm focus:outline-none focus-visible:ring-4 ${theme.ring} transition-colors duration-200`}
              >
                Add to cart
              </button>
            ) : (
              <div
                className={`w-full h-9 md:h-10 ${theme.bg} rounded-lg flex items-center justify-between text-white`}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={stop(onDecrement)}
                  className={`h-full px-4 rounded-lg text-xl font-medium ${theme.hoverBg}`}
                >
                  -
                </button>
                <span className="font-semibold text-base">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={stop(onIncrement)}
                  className={`h-full px-4 rounded-lg text-xl font-medium ${theme.hoverBg}`}
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreItemCard;
