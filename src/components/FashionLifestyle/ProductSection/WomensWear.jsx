"use client";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { slugify } from "../utils/slugify";
import Title from "../CategorySection/Title";
import { WOMEN_TYPE_ID } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { handleProductReducer } from "@/redux/productReducer";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const WomensWear = () => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(8);

  const dispatch = useDispatch();

  const favouriteFashionItems = useSelector(
    (state) => state.userChoice.favouriteFashionItems
  );

  const { usePopularProductsByType } = useCategoryItem();

  const {
    data: productInfo,
    isLoading,
    isError,
  } = usePopularProductsByType(WOMEN_TYPE_ID);

  const handleProductClick = (product) => {
    dispatch(
      handleProductReducer({
        type: "SAVE_CURRENT_PRODUCT_DETAILS",
        data: product,
      })
    );
  };

  const handleViewMore = () => {
    setVisibleProductsCount((prevCount) => prevCount + 8);
  };

  const handleViewLess = () => {
    setVisibleProductsCount(8);
  };

  if (isLoading)
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-8 lg:min-h-10 mb-3 rounded-md bg-gray-200 animate-pulse w-1/3 lg:w-1/4" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );

  if (isError) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title title="Women's Wear" />
          <div className="text-center text-red-500 py-10">
            Failed to load womens products
          </div>
        </div>
      </section>
    );
  }

  if (!productInfo || productInfo?.length === 0) {
    return null;
  }

  const reversedProducts = [...productInfo]?.reverse();
  const displayedProducts = reversedProducts?.slice(0, visibleProductsCount);
  const hasMoreProducts = reversedProducts?.length > visibleProductsCount;

  const toggleWishlist = (e, productId, product) => {
    e.preventDefault();

    if (favouriteFashionItems?.find((product) => product?._id === productId)) {
      removeFromReducer({
        merchantType: 3,
        productId: productId,
      });
    } else {
      addToReducer({
        merchantType: 3,
        itemInfo: [product],
      });
    }
  };

  const addToReducer = (itemInfo) => {
    dispatch(
      handleUserChoiceReducer({
        type: "ADD_TO_FAVOURITE_FASHION_ITEMS",
        data: itemInfo,
      })
    );
    toast.dismiss();
    toast.success("💖 পণ্যটি আপনার ফেভারিট লিস্টের অন্তর্ভূক্ত করা হল!", {
      style: {
        border: "1px solid #FC8F1E",
      },
      iconTheme: {
        primary: "#FC8F1E",
        secondary: "#FFFAEE",
      },
    });
  };

  const removeFromReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "REMOVE_FROM_FAVOURITE_FASHION_ITEMS",
        data: Info,
      })
    );
    toast.dismiss();
    toast("পণ্যটি আপনার ফেভারিট লিস্ট থেকে বাদ দেওয়া হল!", {
      style: {
        border: "1px solid #FC8F1E",
      },
      icon: "🗑️",
      iconTheme: {
        primary: "#FC8F1E",
        secondary: "#FFFAEE",
      },
    });
  };

  return (
    <section className="py-4 lg:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Title title="Women's Fashion Collection" />

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts?.map((product) => (
            <Link
              key={product?._id?.toString()}
              href={`/fashion_lifestyle/view-product/${slugify(
                product?.product_title_eng
              )}_${product?._id}`}
              onClick={() => handleProductClick(product)}
            >
              <div className="group relative">
                <button
                  onClick={(e) => toggleWishlist(e, product?._id, product)}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                    favouriteFashionItems?.find(
                      (item) => item?._id === product?._id
                    )
                      ? "text-red-500 bg-white/90"
                      : "text-gray-400 bg-white/70 hover:text-red-500"
                  }`}
                >
                  <FiHeart
                    className={`text-lg ${
                      favouriteFashionItems?.find(
                        (item) => item?._id === product?._id
                      )
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </button>

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
                            (1 -
                              product?.sale_price / product?.max_retail_price) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-900 font-bold text-sm md:text-base">
                        ৳{product?.sale_price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {reversedProducts?.length > 8 && (
          <div className="mt-12 text-center">
            {hasMoreProducts ? (
              <button
                onClick={handleViewMore}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                View More Products
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleViewLess}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                View Less Products
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default WomensWear;
