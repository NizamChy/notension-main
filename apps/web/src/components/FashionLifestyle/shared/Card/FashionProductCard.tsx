"use client";

import React, { type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import type { FashionProduct } from "@/lib/api/fashion";
import Image from "next/image";
import notify from "@/utils/notify";
import { FiHeart } from "react-icons/fi";
import { slugify } from "../../utils/slugify";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import { useQueryClient } from "@tanstack/react-query";
import { useIsWishlisted, useWishlistStore } from "@/stores/wishlistStore";
import { seedFashionProduct } from "../../hooks/fetchData/useCategoryItem";

/** Standard grid columns for product grids across the fashion module. */
export const PRODUCT_GRID_CLASS =
  "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-8";

/** Responsive `sizes` hint for card images in the grids above. */
export const PRODUCT_IMAGE_SIZES =
  "(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

/** The product fields the card reads (a FashionProduct has them all). */
export type FashionCardProduct = Pick<FashionProduct, "_id"> &
  Partial<
    Pick<
      FashionProduct,
      | "product_title_eng"
      | "sale_price"
      | "max_retail_price"
      | "category_info"
      | "brand_info"
      | "web_image"
      | "new"
      | "bestseller"
      | "featured"
    >
  >;

export type FashionProductCardProps = {
  product: FashionCardProduct;
  href?: string;
  subtitle?: ReactNode;
  showWishlist?: boolean;
  className?: string;
};

/**
 * The single product card used across the fashion module so every grid and
 * slider shows the same image ratio, badge placement, title clamp and
 * price row.
 */
const FashionProductCard = ({
  product,
  href,
  subtitle,
  showWishlist = true,
  className = "",
}: FashionProductCardProps) => {
  const queryClient = useQueryClient();
  const isFavourite = useIsWishlisted(product?._id);

  const productHref =
    href ||
    `/fashion-lifestyle/view-product/${slugify(product?.product_title_eng)}_${
      product?._id
    }`;

  const salePrice = Number(product?.sale_price);
  const mrp = Number(product?.max_retail_price);
  const hasDiscount = mrp > 0 && salePrice < mrp;
  const discount = hasDiscount ? Math.round((1 - salePrice / mrp) * 100) : 0;

  const secondary =
    subtitle !== undefined
      ? subtitle
      : product?.category_info?.category_name ||
        product?.brand_info?.brand_name;

  // The details page then shows the product at once instead of searching for it.
  const handleProductClick = () => seedFashionProduct(queryClient, product);

  const toggleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?._id) return;
    const added = useWishlistStore.getState().toggle(product);
    notify.success(added ? "Added to favourites" : "Removed from favourites");
  };

  // Status tags sit top-left; the discount gets its own orange tag.
  const tag = product?.new
    ? { label: "New", cls: "bg-[#FFFFFF] text-gray-900" }
    : product?.bestseller
      ? { label: "Bestseller", cls: "bg-primary text-white" }
      : product?.featured
        ? { label: "Featured", cls: "bg-[#FFFFFF] text-gray-900" }
        : null;

  return (
    <Link
      href={productHref}
      onClick={handleProductClick}
      className={`group flex h-full flex-col rounded-2xl outline-hidden focus-visible:ring-2 focus-visible:ring-[#0C3F8E] focus-visible:ring-offset-2 ${className}`}
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={
            product?.web_image
              ? `${FASHION_IMAGE_URL}/${product?.web_image}`
              : "/png/dummyImage.png"
          }
          alt={product?.product_title_eng || "Product"}
          fill
          sizes={PRODUCT_IMAGE_SIZES}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        {(tag || hasDiscount) && (
          <div className="absolute left-2 top-2 z-10 flex flex-col items-start gap-1 sm:left-3 sm:top-3">
            {hasDiscount && (
              <span className="rounded-full bg-[#EB5C2F] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white shadow-xs">
                -{discount}%
              </span>
            )}
            {tag && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide shadow-xs ${tag.cls}`}
              >
                {tag.label}
              </span>
            )}
          </div>
        )}

        {showWishlist && (
          <button
            type="button"
            aria-label={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isFavourite}
            onClick={toggleWishlist}
            className={`absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/90 shadow-xs backdrop-blur-sm transition-colors sm:right-3 sm:top-3 ${
              isFavourite
                ? "text-[#D92D20]"
                : "text-[#374151] hover:bg-[#FFFFFF] hover:text-[#D92D20]"
            }`}
          >
            <FiHeart
              className={`text-[17px] ${isFavourite ? "fill-current" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-3">
        {secondary ? (
          <p className="line-clamp-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {secondary}
          </p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-medium leading-snug text-gray-900 group-hover:underline group-hover:decoration-gray-400 group-hover:underline-offset-2">
          {product?.product_title_eng}
        </h3>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
          <span
            className={`text-sm font-bold tabular-nums md:text-base ${
              hasDiscount
                ? "text-[#D9481C] dark:text-[#FF8A5B]"
                : "text-gray-900"
            }`}
          >
            {formatTaka(product?.sale_price)}
          </span>
          {hasDiscount && (
            <span className="text-xs tabular-nums text-gray-400 line-through">
              {formatTaka(product?.max_retail_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FashionProductCard;
