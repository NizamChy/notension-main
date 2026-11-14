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

// Offer banners on a restaurant's page. The box keeps the banners' own
// 1388:400 ratio so nothing is cropped.
const CategoryBannerCarousel = () => {
  return (
    <section
      aria-label="Offers"
      className="relative aspect-[1388/400] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm shadow-gray-900/[0.03]"
    >
      <Swiper
        style={{
          "--swiper-pagination-color": "#EB5C2F",
          "--swiper-pagination-bullet-inactive-color": "#FFF",
          "--swiper-pagination-bullet-inactive-opacity": "0.8",
          "--swiper-pagination-bullet-size": "8px",
          "--swiper-pagination-bullet-horizontal-gap": "4px",
          "--swiper-pagination-bottom": "10px",
        }}
        slidesPerView={1}
        loop={images?.length > 2}
        rewind={images?.length === 2}
        spaceBetween={0}
        autoplay={{ delay: 3000 }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper !absolute inset-0 h-full w-full"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={slide} className="!h-full">
            <Image
              fill
              preload={index === 0}
              sizes="(min-width: 1312px) 1000px, (min-width: 1024px) 70vw, 100vw"
              className="object-cover"
              src={slide}
              alt={`Offer ${index + 1} of ${images.length}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategoryBannerCarousel;
