"use client";

import React from "react";
import toast from "react-hot-toast";
import { FiShare2 } from "react-icons/fi";
import { Badge } from "@/components/shared/UI/UI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const ProductInfo = ({ product }) => {
  const rating = Number(product?.rating) || 0;
  const salePrice = Number(product?.sale_price);
  const mrp = Number(product?.max_retail_price);
  const hasDiscount = mrp > 0 && salePrice < mrp;
  const discount = hasDiscount ? Math.round((1 - salePrice / mrp) * 100) : 0;

  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<BsStarFill key={i} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<BsStarHalf key={i} />);
      } else {
        stars.push(<BsStar key={i} />);
      }
    }

    return stars;
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.product_title_eng, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.dismiss();
      toast.success("Link copied");
    } catch {
      // User closed the share sheet or clipboard is blocked.
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {product?.brand_info?.brand_name && (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
              {product.brand_info.brand_name}
            </p>
          )}
          <h1 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">
            {product?.product_title_eng}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share this product"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <FiShare2 />
        </button>
      </div>

      {rating > 0 && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="flex gap-0.5 text-[#F79009]" aria-hidden>
            {renderRatingStars()}
          </span>
          <span className="text-gray-500">
            <span className="font-semibold text-gray-900">{rating}</span>
            {product?.reviews ? ` (${product.reviews} reviews)` : ""}
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`text-2xl font-bold tabular-nums md:text-3xl ${
            hasDiscount ? "text-[#D9481C] dark:text-[#FF8A5B]" : "text-gray-900"
          }`}
        >
          {formatTaka(product?.sale_price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base tabular-nums text-gray-400 line-through">
              {formatTaka(product?.max_retail_price)}
            </span>
            <Badge tone="orange">{discount}% OFF</Badge>
          </>
        )}
      </div>
      {hasDiscount && (
        <p className="mt-1 text-sm font-medium text-[#067647] dark:text-[#47CD89]">
          You save {formatTaka(mrp - salePrice)}
        </p>
      )}
    </div>
  );
};

export default ProductInfo;
