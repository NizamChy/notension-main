"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const HomeSlider = () => {
  const slides = [
    "bg-banner-new-07-1.webp",
    "bg-banner-new-07-2.webp",
    "bg-banner-new-07-3.webp",
    "bg-banner-new-07-4.webp",
  ];

  return (
    <>
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
        className="mySwiper z-50 relative max-w-[632px]"
      >
        {slides?.map((slide, index) => (
          <SwiperSlide key={index} className="">
            <Image
              className="object-cover transition-transform duration-300 hover:scale-105"
              src={`/images/home/bg-banner-new-07-${index + 1}.webp`}
              alt="bg-banner"
              width={632}
              height={300}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default HomeSlider;
