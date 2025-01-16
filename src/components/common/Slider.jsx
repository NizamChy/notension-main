"use client";

import React from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";

const Slider = ({ slides, classNames }) => {
  return (
    <>
      {slides?.length > 0 && (
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
          className={`mySwiper z-50 relative ${classNames}`}
        >
          {slides?.map((slide) => (
            <SwiperSlide key={slide._id} className="rounded-lg">
              <Image
                className="w-full max-w-full h-auto object-cover rounded-lg"
                src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${slide?.file_name}`}
                alt={`Slide ${slide?.file_name}`}
                width={1000}
                height={1000}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default Slider;
