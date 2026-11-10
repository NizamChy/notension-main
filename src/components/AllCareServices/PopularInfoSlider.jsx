"use client";

import "swiper/css";
import React, { useState } from "react";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

const PopularInfoSlider = ({ slider }) => {
  // Each slider binds its own arrow elements (no shared DOM ids).
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  return (
    <>
      {slider?.length > 0 && (
        <div>
          <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-5 text-[#0C3F8E]">
            Popular Information
          </h2>

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
                  <SwiperSlide
                    key={slide?._id}
                    className="flex justify-center items-center"
                  >
                    <div className="w-full aspect-[2/1] overflow-hidden rounded-lg bg-gray-50 cursor-pointer">
                      <Image
                        className="w-full h-full object-cover"
                        src={`${SERVICE_PROVIDER_IMAGES}/${slide?.provider_banner_app}`}
                        alt={slide?.provider_name}
                        width={455}
                        height={228}
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

export default PopularInfoSlider;
