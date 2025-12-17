"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { slugify } from "../utils/slugify";
import { FiShoppingCart } from "react-icons/fi";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { handleProductReducer } from "@/redux/productReducer";

const PopularProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleProductClick = (product) => {
    dispatch(
      handleProductReducer({
        type: "SAVE_CURRENT_PRODUCT_DETAILS",
        data: product,
      })
    );
  };

  return (
    <Link
      href={`/fashion_lifestyle/view-product/${slugify(
        product?.product_title_eng
      )}_${product?._id}`}
      onClick={() => handleProductClick(product)}
    >
      <div className="group relative cursor-pointer">
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {product?.new && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          {product?.bestseller && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Bestseller
            </span>
          )}
          {product?.featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden mb-3">
          <Image
            src={
              product?.web_image
                ? `${FASHION_IMAGE_URL}/${product?.web_image}`
                : "/png/dummyImage.png"
            }
            alt={product?.product_title_eng}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          <button className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <FiShoppingCart className="text-lg" />
          </button>
        </div>

        <div className="px-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {product?.product_title_eng}
          </h3>

          <div className="flex items-center gap-2">
            {product?.max_retail_price > product?.sale_price ? (
              <>
                <span className="text-gray-900 font-bold text-sm md:text-base">
                  ৳{product?.sale_price}
                </span>
                <span className="text-gray-500 line-through text-xs md:text-sm">
                  ৳{product?.max_retail_price}
                </span>
                <span className="text-red-600 text-xs font-medium">
                  {Math.round(
                    (1 - product?.sale_price / product?.max_retail_price) * 100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <span className="text-sm md:text-base text-gray-900 font-bold">
                ৳{product?.sale_price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularProductCard;
