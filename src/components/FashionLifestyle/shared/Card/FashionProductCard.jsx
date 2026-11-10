"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiHeart } from "react-icons/fi";
import { slugify } from "../../utils/slugify";
import { useDispatch, useSelector } from "react-redux";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { handleProductReducer } from "@/redux/productReducer";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";

const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return Number.isInteger(n) ? n : n.toFixed(2);
};

/** Standard grid columns for product grids across the fashion module. */
export const PRODUCT_GRID_CLASS =
  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6";

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
}) => {
  const dispatch = useDispatch();
  const favouriteFashionItems = useSelector(
    (state) => state.userChoice?.favouriteFashionItems
  );

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

  const isFavourite = !!favouriteFashionItems?.find(
    (item) => item?._id === product?._id
  );

  const handleProductClick = () => {
    dispatch(
      handleProductReducer({
        type: "SAVE_CURRENT_PRODUCT_DETAILS",
        data: product,
      })
    );
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavourite) {
      dispatch(
        handleUserChoiceReducer({
          type: "REMOVE_FROM_FAVOURITE_FASHION_ITEMS",
          data: { merchantType: 3, productId: product?._id },
        })
      );
      toast.dismiss();
      toast("পণ্যটি আপনার ফেভারিট লিস্ট থেকে বাদ দেওয়া হল!", {
        style: { border: "1px solid #FC8F1E" },
        icon: "🗑️",
      });
    } else {
      dispatch(
        handleUserChoiceReducer({
          type: "ADD_TO_FAVOURITE_FASHION_ITEMS",
          data: { merchantType: 3, itemInfo: [product] },
        })
      );
      toast.dismiss();
      toast.success("💖 পণ্যটি আপনার ফেভারিট লিস্টের অন্তর্ভূক্ত করা হল!", {
        style: { border: "1px solid #FC8F1E" },
        iconTheme: { primary: "#FC8F1E", secondary: "#FFFAEE" },
      });
    }
  };

  const badges = [
    product?.new && { label: "New", cls: "bg-green-600" },
    product?.bestseller && { label: "Bestseller", cls: "bg-blue-600" },
    product?.featured && { label: "Featured", cls: "bg-yellow-500" },
    hasDiscount && { label: `-${discount}%`, cls: "bg-red-500" },
  ].filter(Boolean);

  return (
    <Link
      href={productHref}
      onClick={handleProductClick}
      className={`group flex flex-col h-full bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            product?.web_image
              ? `${FASHION_IMAGE_URL}/${product?.web_image}`
              : "/png/dummyImage.png"
          }
          alt={product?.product_title_eng}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 pr-10">
            {badges.map((b) => (
              <span
                key={b.label}
                className={`${b.cls} text-white text-[10px] sm:text-xs font-semibold leading-none px-1.5 sm:px-2 py-1 rounded`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}

        {showWishlist && (
          <button
            type="button"
            aria-label={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-colors ${
              isFavourite
                ? "text-red-500 bg-white"
                : "text-gray-500 bg-white/80 hover:text-red-500 hover:bg-white"
            }`}
          >
            <FiHeart className={`text-base ${isFavourite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1 p-2.5 sm:p-3">
        <h3 className="text-sm md:text-base font-medium text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] md:min-h-[2.75rem]">
          {product?.product_title_eng}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-1 min-h-[1rem]">
          {secondary || ""}
        </p>

        <div className="mt-auto pt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm md:text-base font-bold text-gray-900">
            ৳{formatPrice(product?.sale_price)}
          </span>
          {hasDiscount && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ৳{formatPrice(product?.max_retail_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FashionProductCard;
