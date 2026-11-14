"use client";

import React from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";

// Food banner slider. The box keeps a fixed 5:2 ratio (the banners' own
// ratio) and the slides cover it, so sliders placed side by side always have
// identical heights.
const Slider = ({ slides, classNames = "" }) => {
  if (!slides?.length) return null;

  return (
    <div
      className={`relative w-full aspect-[5/2] overflow-hidden rounded-2xl bg-gray-100 ${classNames}`}
    >
      <Swiper
        style={{
          "--swiper-pagination-color": "#EB5C2F",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-horizontal-gap": "5px",
          "--swiper-pagination-bullet-inactive-color": "#FFF",
        }}
        slidesPerView={1}
        // Swiper's loop mode needs more slides than are visible + 1; with
        // only two it leaves slides half-shifted, so rewind instead.
        loop={slides.length > 2}
        rewind={slides.length === 2}
        spaceBetween={0}
        autoplay={{ delay: 3000 }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper !absolute inset-0 w-full h-full rounded-2xl"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide._id}
            className="!h-full relative overflow-hidden"
          >
            <Image
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${slide?.file_name}`}
              alt={`Slide ${slide?.file_name}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
