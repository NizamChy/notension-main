"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { getStoreModule } from "./storeModules";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";

// Banner slider for the grocery / medicine store pages. The box always keeps
// at least a 5:2 ratio (the banners' own ratio) via an in-flow spacer, and
// grows to its parent's height when that is taller (`h-full` on a stretched
// grid cell), so a slider placed beside another card lines up with it. Slides
// cover the box, so every slider on a page has the same shape.
const CommonSlider = ({ moduleName, slides, classNames = "" }) => {
  const { sliderImageBaseUrl } = getStoreModule(moduleName);

  if (!slides?.length) return null;

  return (
    <div className={`relative w-full h-full ${classNames}`}>
      <div aria-hidden className="w-full aspect-[5/2]" />
      <Swiper
        style={{
          "--swiper-pagination-color": "#EB5C2F",
          "--swiper-pagination-bullet-inactive-color": "#FFF",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-horizontal-gap": "5px",
        }}
        slidesPerView={1}
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
          <SwiperSlide key={slide?._id} className="!h-full">
            <Image
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              src={`${sliderImageBaseUrl}/${slide?.file_name}`}
              alt={`Slide ${slide?.file_name}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommonSlider;
