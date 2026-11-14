"use client";

import "swiper/css";
import React, { useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { SERVICE_BANNER_IMAGES } from "@/api-endpoints/api-endpoint";

export const SLIDER_ARROW =
  "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-xl text-gray-800 shadow-md shadow-gray-900/10 transition-colors hover:bg-gray-50 hover:text-[#0C3F8E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] dark:hover:text-[#7FB2FF] md:flex";

// Promotional banner carousel shown between service groups.
const ServicesSlider = ({ slider }) => {
  // The home page renders several of these sliders, so each one binds its
  // own arrow elements instead of sharing a DOM id.
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  if (!(slider?.length > 0)) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous banner"
        className={`${SLIDER_ARROW} left-0 -translate-x-1/2`}
        ref={setPrevEl}
      >
        <HiChevronLeft aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Next banner"
        className={`${SLIDER_ARROW} right-0 translate-x-1/2`}
        ref={setNextEl}
      >
        <HiChevronRight aria-hidden="true" />
      </button>

      <Swiper
        slidesPerView={1.15}
        spaceBetween={12}
        // Up to 3 slides are visible; loop mode needs at least twice
        // that, otherwise slides end up half-shifted.
        loop={slider?.length >= 6}
        rewind={slider?.length < 6}
        navigation={{ prevEl, nextEl }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        modules={[Navigation]}
        className="w-full"
      >
        {slider?.map((slide) => (
          <SwiperSlide key={slide?._id}>
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <Image
                className="object-cover"
                src={`${SERVICE_BANNER_IMAGES}/${slide?.file_name}`}
                alt="Service offer"
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 87vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ServicesSlider;
