"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { handleProductReducer } from "@/redux/productReducer";

const ProductCards = ({ product }) => {
  const params = useParams();
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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={
          params?.shopSlugId
            ? `/fashion_lifestyle/shop/${
                params?.shopSlugId
              }/view-product/${slugify(product?.product_title_eng)}_${
                product?._id
              }`
            : `/fashion_lifestyle/view-product/${slugify(
                product?.product_title_eng
              )}_${product?._id}`
        }
        onClick={() => handleProductClick(product)}
      >
        <div className="block">
          <div className="aspect-[3/4] bg-gray-100 relative">
            <img
              src={
                product?.web_image
                  ? `${FASHION_IMAGE_URL}/${product?.web_image}`
                  : "/png/dummyImage.png"
              }
              alt={product?.product_title_eng}
              className="w-full h-full object-cover"
            />

            {/* {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium">Out of Stock</span>
              </div>
            )} */}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
              {product?.product_title_eng}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {product?.brand_info?.brand_name}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                ৳{product?.sale_price?.toFixed(2)}
              </span>
              {product?.sale_price < product?.max_retail_price && (
                <span className="text-sm text-gray-500 line-through">
                  ৳{product?.max_retail_price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCards;
