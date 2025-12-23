"use client";

import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

import "swiper/css";
import "swiper/css/navigation";

const ThumbnailSlider = ({
  detailImages,
  setCurrentImageIndex,
  currentImageIndex,
  product,
}) => {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      slidesPerView={4}
      spaceBetween={10}
      className="thumbnail-swiper"
      touchStartPreventDefault={false}
    >
      {detailImages.map((img, index) => (
        <SwiperSlide key={index}>
          <button
            onClick={() => setCurrentImageIndex(index)}
            className={`w-full aspect-square bg-gray-100 rounded overflow-hidden border ${
              currentImageIndex === index
                ? "border-indigo-500"
                : "border-transparent"
            }`}
          >
            <img
              src={`${FASHION_IMAGE_URL}/${img}`}
              alt={`${product?.product_title_eng} thumbnail ${index + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ThumbnailSlider;
