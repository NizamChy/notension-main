"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

const PopularInfoSlider = ({ slider }) => {
  return (
    <>
      {slider?.length > 0 && (
        <div className="py-5 lg:py-20">
          <p className="md:text-2xl font-semibold pb-1 md:pb-5 text-[#0C3F8E]">
            Popular Information
          </p>

          <div className="relative flex justify-center items-center">
            <button
              className="hidden md:block absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-[#0C3F8E]"
              id="custom-prev-doc"
            >
              <GrPrevious />
            </button>

            <button
              className="hidden md:block absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-[#0C3F8E]"
              id="custom-next-doc"
            >
              <GrNext />
            </button>

            <div className="w-full flex justify-center mx-auto ps-3 md:px-5 items-center">
              <Swiper
                slidesPerView={1.2}
                spaceBetween={20}
                loop={true}
                navigation={{
                  prevEl: "#custom-prev-doc",
                  nextEl: "#custom-next-doc",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1536: {
                    slidesPerView: 3,
                    spaceBetween: 30,
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
                    <div className="lg:m-3 cursor-pointer">
                      <Image
                        className="rounded-md w-full"
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
