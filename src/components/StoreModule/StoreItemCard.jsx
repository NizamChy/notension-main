"use client";

import Image from "next/image";
import React, { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { CARD, CARD_HOVER } from "@/components/shared/UI/UI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";

const stop = (handler) => (event) => {
  event.preventDefault();
  event.stopPropagation();
  handler?.(event);
};

const hasValue = (value) => value != null && value !== "";

// Presentational product card shared by the food, grocery and medicine lists.
// It fills its grid cell (h-full): square image, title clamped to two lines,
// one-line subtitle, then the price row and button pinned to the bottom
// (mt-auto) — so all cards in a grid row are the same height and their
// prices / buttons line up. `moduleName` only picks the image fit: food
// photos fill the box, packshots (grocery / medicine) sit on a light base.
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
  const isPhoto = moduleName === "food";
  const showMrp = hasValue(mrp) && Number(salePrice) < Number(mrp);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={title ? `View ${title}` : "View product"}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && event.key === "Enter") onClick?.(event);
      }}
      className={`group flex h-full cursor-pointer flex-col overflow-hidden ${CARD} ${CARD_HOVER} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3F8E]/40`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F6F7F9]">
        {isImageLoading && (
          <div className="absolute inset-0 animate-pulse bg-[#ECEEF2]" />
        )}

        <Image
          fill
          sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
          src={imageSrc || "/png/dummyImage.png"}
          alt={title || "Product image"}
          className={`transition duration-300 group-hover:scale-[1.04] ${
            isPhoto ? "object-cover" : "object-contain p-3 md:p-4"
          } ${isImageLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />

        {discountLabel && (
          <span className="absolute left-2 top-2 rounded-full bg-[#EB5C2F] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm md:left-3 md:top-3">
            {discountLabel}
          </span>
        )}

        {onFavoriteToggle && (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={!!isFavorite}
            onClick={stop(onFavoriteToggle)}
            className={`absolute right-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/90 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-[#FFFFFF] md:right-2 md:top-2 ${
              isFavorite ? "text-[#D92D20]" : "text-[#475467] hover:text-[#D92D20]"
            }`}
          >
            {isFavorite ? (
              <HiHeart className="text-lg" />
            ) : (
              <HiOutlineHeart className="text-lg" />
            )}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-3.5">
        <h3
          title={title}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-gray-900"
        >
          {title}
        </h3>
        <p className="mt-0.5 min-h-[1rem] truncate text-xs text-gray-500">
          {subtitle}
        </p>

        <div className="mt-auto flex min-h-[1.75rem] flex-wrap items-baseline gap-x-1.5 pt-2.5">
          {hasValue(salePrice) && (
            <span className="text-base font-bold tabular-nums text-gray-900">
              {formatTaka(salePrice)}
            </span>
          )}
          {showMrp && (
            <span className="text-xs tabular-nums text-gray-400 line-through">
              {formatTaka(mrp)}
            </span>
          )}
        </div>

        {showCartControls && (
          <div className="mt-2.5" onClick={stop()}>
            {quantity === 0 ? (
              <button
                type="button"
                onClick={stop(onAddToCart)}
                aria-label={title ? `Add ${title} to cart` : "Add to cart"}
                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#0C3F8E]/[0.08] text-sm font-semibold text-[#0C3F8E] transition-colors hover:bg-[#0C3F8E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3F8E]/40 dark:bg-[#7FB2FF]/10 dark:text-[#7FB2FF] dark:hover:bg-[#0C3F8E] dark:hover:text-white"
              >
                <HiPlus className="text-base" />
                Add
              </button>
            ) : (
              <div className="flex h-10 w-full items-center justify-between rounded-full bg-[#0C3F8E] text-white shadow-sm shadow-[#0C3F8E]/20">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={stop(onDecrement)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#FFFFFF]/15"
                >
                  <HiMinus />
                </button>
                <span
                  aria-live="polite"
                  className="text-sm font-semibold tabular-nums"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={stop(onIncrement)}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#FFFFFF]/15"
                >
                  <HiPlus />
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
