"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { getStoreModule } from "./storeModules";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";

const CommonSlider = ({ moduleName, slides, classNames = "" }) => {
  const { sliderImageBaseUrl } = getStoreModule(moduleName);

  if (!slides?.length) return null;

  return (
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
      className={`mySwiper z-50 relative ${classNames} rounded-lg`}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide?._id} className="rounded-lg">
          <Image
            className="w-full max-w-full h-auto object-cover rounded-lg"
            src={`${sliderImageBaseUrl}/${slide?.file_name}`}
            alt={`Slide ${slide?.file_name}`}
            width={1000}
            height={1000}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CommonSlider;
