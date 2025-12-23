"use client";

import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

const ThumbnailSlider = ({
  detailImages,
  setCurrentImageIndex,
  currentImageIndex,
  product,
}) => {
  // Prevent event bubbling for touch events
  const handleTouchStart = (e) => {
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Swiper Thumbnail Gallery */}
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={4}
        spaceBetween={10}
        className="thumbnail-swiper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {detailImages?.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`w-full aspect-square bg-gray-100 rounded overflow-hidden ${
                  currentImageIndex === index ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <img
                  src={`${FASHION_IMAGE_URL}/${img}`}
                  alt={`${product?.product_title_eng} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ThumbnailSlider;
