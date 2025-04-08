"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";

const CategoryBannerCarousel = () => {
  const images = [
    "/images/food/food-banner-1.png",
    "/images/food/food-banner-2.png",
    "/images/food/food-banner-3.png",
    "/images/food/food-banner-4.png",
  ];

  return (
    <div className="px-4 md:px-2">
      <Swiper
        style={{
          "--swiper-pagination-color": "#EB5C2F",
          "--swiper-pagination-bullet-inactive-color": "#FFF",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "12px",
          "--swiper-pagination-bullet-horizontal-gap": "6px",
        }}
        slidesPerView={1}
        loop={true}
        spaceBetween={30}
        autoplay={{ delay: 3000 }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper z-50 relative rounded-lg"
      >
        {images?.map((slide, index) => (
          <SwiperSlide key={index} className="rounded-lg">
            <Image
              // className="lg:h-[340px] object-cover rounded-lg"
              className="lg:h-[364px] object-cover rounded-lg"
              src={slide}
              alt={`Slide ${index + 1}`}
              width={1388}
              height={400}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryBannerCarousel;
