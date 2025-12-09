"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { slugify } from "../../utils/slugify";
import { useSearchParams } from "next/navigation";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { handleProductReducer } from "@/redux/productReducer";
import { useCategoryItem } from "../../hooks/fetchData/useCategoryItem";
import ProductCardSkeleton from "../SkeletonLoading/ProductCardSkeleton";
import NoItemFound from "@/components/common/NoItemFound";

const FashionSearchedProducts = () => {
  const { useSearchedProductsByType } = useCategoryItem();

  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");
  const typeId = searchParams.get("type_id");

  const {
    data: productInfo,
    isLoading,
    isError,
  } = useSearchedProductsByType(typeId, searchText);

  const handleProductClick = (product) => {
    dispatch(
      handleProductReducer({
        type: "SAVE_CURRENT_PRODUCT_DETAILS",
        data: product,
      })
    );
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
          <div className="text-center text-red-500 py-10">
            Failed to load searched products!
          </div>
        </div>
      </section>
    );
  }

  if (!productInfo || productInfo?.length === 0) {
    return <NoItemFound />;
  }

  return (
    <div className="min-h-content">
      <section className="py-4 lg:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4 pt-12 lg:pt-0">
            Items found for{" "}
            <span className="text-gray-700">"{searchText}"</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productInfo?.map((product) => (
              <Link
                key={product?._id?.toString()}
                href={`/fashion_lifestyle/view-product/${slugify(
                  product?.product_title_eng
                )}_${product?._id}`}
                onClick={() => handleProductClick(product)}
              >
                <div className="group relative">
                  <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={
                        product?.web_image
                          ? `${FASHION_IMAGE_URL}/${product?.web_image}`
                          : "/images/png/dummyImage.png"
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
                                product?.sale_price /
                                  product?.max_retail_price) *
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
        </div>
      </section>
    </div>
  );
};

export default FashionSearchedProducts;
