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
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm shadow-gray-900/[0.03] ${classNames}`}
    >
      <div aria-hidden className="w-full aspect-[5/2]" />
      <Swiper
        style={{
          "--swiper-pagination-color": "#FFFFFF",
          "--swiper-pagination-bullet-inactive-color": "#FFFFFF",
          "--swiper-pagination-bullet-inactive-opacity": "0.55",
          "--swiper-pagination-bullet-size": "7px",
          "--swiper-pagination-bullet-horizontal-gap": "3px",
          "--swiper-pagination-bottom": "10px",
        }}
        slidesPerView={1}
        loop={slides.length > 2}
        rewind={slides.length === 2}
        spaceBetween={0}
        autoplay={{ delay: 3000 }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper !absolute inset-0 w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide?._id} className="!h-full">
            <Image
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              src={`${sliderImageBaseUrl}/${slide?.file_name}`}
              alt={`Promotional banner ${index + 1} of ${slides.length}`}
            />
            {/* Soft bottom fade keeps the pagination dots readable. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommonSlider;
