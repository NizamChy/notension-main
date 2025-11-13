"use client";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FASHION_CAROUSEL_SLIDES } from "../utils/constants";

const StoreSlider = () => {
  return (
    <div className="w-full lg:py-10 max-w-screen-2xl mx-auto px-4">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-gray-100 !opacity-100",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-gray-600",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full rounded-lg"
      >
        {FASHION_CAROUSEL_SLIDES?.map((slide) => (
          <SwiperSlide key={slide?.id} className="w-full">
            <div className="relative w-full h-[250px] md:h-[400px]">
              <img
                src={slide?.image}
                alt={slide?.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StoreSlider;
