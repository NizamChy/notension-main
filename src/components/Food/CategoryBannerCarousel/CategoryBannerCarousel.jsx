"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";

const images = [
  "/images/food/food-banner-1.png",
  "/images/food/food-banner-2.png",
  "/images/food/food-banner-3.png",
  "/images/food/food-banner-4.png",
];

// Full-width banner slider of a food store; the box keeps the banners' own
// 1388:400 ratio so nothing is cropped.
const CategoryBannerCarousel = () => {
  return (
    <div className="relative w-full aspect-[1388/400]">
      <Swiper
        style={{
          "--swiper-pagination-color": "#EB5C2F",
          "--swiper-pagination-bullet-inactive-color": "#FFF",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-horizontal-gap": "5px",
        }}
        slidesPerView={1}
        loop={images?.length > 2}
        rewind={images?.length === 2}
        spaceBetween={0}
        autoplay={{ delay: 3000 }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper !absolute inset-0 w-full h-full rounded-2xl"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={slide} className="!h-full">
            <Image
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 75vw, 100vw"
              className="object-cover"
              src={slide}
              alt={`Slide ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryBannerCarousel;
