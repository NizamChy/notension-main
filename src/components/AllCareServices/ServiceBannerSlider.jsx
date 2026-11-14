"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { SERVICE_BANNER_IMAGES } from "@/api-endpoints/api-endpoint";

// Auto-playing banner carousel for one service category (fixed 2:1 box).
const ServiceBannerSlider = ({ slider }) => {
  if (!(slider?.length > 0)) return null;

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-100">
      <Swiper
        style={{
          "--swiper-pagination-color": "#EB5C2F",
          "--swiper-pagination-bullet-size": "8px",
          "--swiper-pagination-bullet-horizontal-gap": "4px",
          "--swiper-pagination-bullet-inactive-opacity": "0.7",
          "--swiper-pagination-bullet-inactive-color": "#FFF",
        }}
        loop={slider?.length > 2}
        rewind={slider?.length === 2}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{ delay: 3000 }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper !absolute inset-0 h-full w-full"
      >
        {slider?.map((image, index) => (
          <SwiperSlide key={index} className="relative !h-full">
            <Image
              className="object-cover"
              src={`${SERVICE_BANNER_IMAGES}/${image}`}
              alt="Service banner"
              fill
              sizes="(min-width: 1024px) 880px, 100vw"
              preload={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ServiceBannerSlider;
