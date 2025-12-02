import React from "react";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const ProductInfo = ({ product }) => {
  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(product?.rating);
    const hasHalfStar = product?.rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<BsStarFill key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<BsStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product?.product_title_eng}
          </h1>
          <p className="text-gray-600 text-lg">
            {product?.brand_info?.brand_name}
          </p>
        </div>
        <div className="flex gap-2">
          {/* <button className="p-2 rounded-full hover:bg-gray-100">
            <FiHeart className="text-gray-600" />
          </button> */}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiShare2 className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center mt-2 mb-4">
        <div className="flex mr-2">{renderRatingStars()}</div>
        <span className="text-gray-600 text-sm">
          {product?.rating} ({product?.reviews} reviews)
        </span>
      </div>

      <div className="my-4">
        {product?.max_retail_price > product?.sale_price ? (
          <>
            <span className="text-2xl font-bold text-gray-900">
              ৳ {product?.sale_price?.toFixed(2)}
            </span>
            <span className="ml-2 text-lg text-gray-500 line-through">
              ৳ {product?.max_retail_price?.toFixed(2)}
            </span>
            <span className="ml-2 text-red-500 font-medium">
              (
              {Math.round(
                (1 - product?.sale_price / product?.max_retail_price) * 100
              )}
              % OFF)
            </span>
          </>
        ) : (
          <span className="text-2xl font-bold text-gray-900">
            ৳ {product?.sale_price?.toFixed(2)}
          </span>
        )}
      </div>
    </>
  );
};

export default ProductInfo;
