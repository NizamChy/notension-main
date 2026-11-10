"use client";

import "swiper/css";
import React, { useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { SERVICE_BANNER_IMAGES } from "@/api-endpoints/api-endpoint";

const ServicesSlider = ({ slider }) => {
  // The home page renders several of these sliders, so each one binds its
  // own arrow elements instead of sharing a DOM id.
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <>
      {slider?.length > 0 && (
        <div>
          <div className="relative flex justify-center items-center">
            <button
              type="button"
              aria-label="Previous slide"
              className="hidden md:block absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-[#0C3F8E]"
              ref={setPrevEl}
            >
              <GrPrevious />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              className="hidden md:block absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-[#0C3F8E]"
              ref={setNextEl}
            >
              <GrNext />
            </button>

            <div className="w-full flex justify-center mx-auto items-center">
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
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                modules={[Navigation]}
                className="mx-auto w-full"
              >
                {slider?.map((slide) => (
                  <SwiperSlide key={slide?._id} className="flex justify-center">
                    <div className="w-full cursor-pointer">
                      <Image
                        className="rounded-lg shadow-sm w-full h-auto"
                        src={`${SERVICE_BANNER_IMAGES}/${slide?.file_name}`}
                        alt={slide?.file_name}
                        width={420}
                        height={280}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesSlider;
