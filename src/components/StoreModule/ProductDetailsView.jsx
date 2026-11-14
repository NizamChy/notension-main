"use client";

import Image from "next/image";
import React, { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { Badge, Skeleton } from "@/components/shared/UI/UI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";

const hasValue = (value) => value != null && value !== "";

// "10% OFF" / "৳20 OFF" from an item's less / less_type, or null.
export const discountLabelOf = (item) =>
  item?.less > 0
    ? `${item.less}${item?.less_type === "Percent" ? "%" : "৳"} OFF`
    : null;

const Spinner = () => (
  <svg
    aria-hidden
    className="h-4 w-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Presentational product details used by the grocery / medicine product
// pages (variant="page") and the quick-view modals (variant="modal").
// All data and handlers come from the caller.
const ProductDetailsView = ({
  variant = "page",
  imageSrc,
  title,
  altTitle,
  highlight,
  byline,
  chips = [],
  badges = [],
  discountLabel,
  salePrice,
  mrp,
  savings,
  isAvailable,
  details = [],
  quantity = 0,
  isBusy = false,
  onAddToCart,
  onIncrement,
  onDecrement,
  isFavorite,
  onFavoriteToggle,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isModal = variant === "modal";
  const TitleTag = isModal ? "h2" : "h1";
  const showMrp = hasValue(mrp) && Number(salePrice) < Number(mrp);
  const visibleChips = chips.filter(Boolean);
  const visibleDetails = details.filter((row) => hasValue(row?.value));

  return (
    <div
      className={`grid gap-5 ${
        isModal
          ? "sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-6"
          : "md:grid-cols-2 md:gap-10 lg:gap-12"
      }`}
    >
      {/* Image */}
      <div className={isModal ? "mx-auto w-full max-w-[18rem] sm:max-w-none" : ""}>
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-[#F6F7F9]">
          {isImageLoading && (
            <div className="absolute inset-0 animate-pulse bg-[#ECEEF2]" />
          )}
          <Image
            fill
            sizes={isModal ? "(min-width: 640px) 320px, 288px" : "(min-width: 768px) 45vw, 100vw"}
            src={imageSrc || "/png/dummyImage.png"}
            alt={title || "Product image"}
            loading={isModal ? undefined : "eager"}
            fetchPriority={isModal ? undefined : "high"}
            className={`object-contain p-6 md:p-8 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
          {discountLabel && (
            <span className="absolute left-3 top-3 rounded-full bg-[#EB5C2F] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              {discountLabel}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-col">
        {(badges.length > 0 || isAvailable != null) && (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {isAvailable != null && (
              <Badge tone={isAvailable ? "green" : "red"}>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAvailable ? "bg-[#12B76A]" : "bg-[#D92D20]"
                  }`}
                />
                {isAvailable ? "In stock" : "Out of stock"}
              </Badge>
            )}
            {badges.map((badge) => (
              <Badge key={badge.label} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}

        <TitleTag
          className={`font-bold tracking-tight text-gray-900 ${
            isModal ? "pr-6 text-lg leading-snug md:text-xl" : "text-xl leading-tight md:text-3xl"
          }`}
        >
          {title}
        </TitleTag>
        {altTitle && (
          <p className="mt-1 text-sm text-gray-500">{altTitle}</p>
        )}
        {highlight && (
          <p className="mt-2 text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
            {highlight}
          </p>
        )}
        {byline && <p className="mt-0.5 text-sm text-gray-500">by {byline}</p>}

        {visibleChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div
          className={`mt-5 border-t border-gray-100 pt-5 ${isModal ? "" : "md:mt-6 md:pt-6"}`}
        >
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            {hasValue(salePrice) && (
              <span
                className={`font-bold tabular-nums text-gray-900 ${
                  isModal ? "text-2xl" : "text-3xl"
                }`}
              >
                {formatTaka(salePrice)}
              </span>
            )}
            {showMrp && (
              <span className="text-sm tabular-nums text-gray-400 line-through">
                MRP {formatTaka(mrp)}
              </span>
            )}
          </div>
          {Number(savings) > 0 && (
            <p className="mt-1.5 text-sm font-semibold text-[#067647] dark:text-[#47CD89]">
              You save {formatTaka(savings)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isBusy}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-6 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478] disabled:cursor-wait disabled:opacity-70 sm:max-w-xs"
            >
              {isBusy ? <Spinner /> : <HiOutlineShoppingBag className="text-lg" />}
              {isBusy ? "Adding…" : "Add to cart"}
            </button>
          ) : (
            <div className="flex h-12 flex-1 items-center justify-between rounded-full bg-[#0C3F8E] p-1 text-white shadow-sm shadow-[#0C3F8E]/20 sm:max-w-xs">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={onDecrement}
                disabled={isBusy}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#FFFFFF]/15 disabled:opacity-60"
              >
                <HiMinus />
              </button>
              <span aria-live="polite" className="text-sm font-semibold tabular-nums">
                {quantity} in cart
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={onIncrement}
                disabled={isBusy}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#FFFFFF]/15 disabled:opacity-60"
              >
                <HiPlus />
              </button>
            </div>
          )}

          {onFavoriteToggle && (
            <button
              type="button"
              onClick={onFavoriteToggle}
              disabled={isBusy}
              aria-pressed={!!isFavorite}
              aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-60 ${
                isFavorite
                  ? "border-[#D92D20]/30 bg-[#D92D20]/10 text-[#D92D20]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-[#D92D20]"
              }`}
            >
              {isFavorite ? <HiHeart className="text-xl" /> : <HiOutlineHeart className="text-xl" />}
            </button>
          )}
        </div>

        {visibleDetails.length > 0 && (
          <dl className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-gray-50/60 text-sm">
            {visibleDetails.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <dt className="text-gray-500">{row.label}</dt>
                <dd className="text-right font-medium text-gray-900">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
};

// Loading placeholder with the same layout as ProductDetailsView.
export const ProductDetailsSkeleton = ({ variant = "page" }) => {
  const isModal = variant === "modal";
  return (
    <div
      aria-hidden
      className={`grid w-full gap-5 ${
        isModal ? "sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-6" : "md:grid-cols-2 md:gap-10"
      }`}
    >
      <Skeleton className={`aspect-square w-full !rounded-2xl ${isModal ? "mx-auto max-w-[18rem] sm:max-w-none" : ""}`} />
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 !rounded-full" />
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 !rounded-full" />
          <Skeleton className="h-6 w-20 !rounded-full" />
        </div>
        <Skeleton className="!mt-6 h-8 w-32" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-12 flex-1 !rounded-full sm:max-w-xs" />
          <Skeleton className="h-12 w-12 !rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsView;
