"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const HomeSlider = () => {
  const images = [
    "/images/home/home-slider1-img1.jpg",
    "/images/home/home-slider1-img2.jpg",
    "/images/home/home-slider1-img3.jpg",
    "/images/home/home-slider1-img4.jpg",
  ];

  return (
    <div>
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
        className="mySwiper z-50 relative max-w-[632px] md:w-full w-[450px]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              className="object-cover transition-transform duration-300 hover:scale-105 w-full"
              src={image}
              alt={`Slide ${index + 1}`}
              width={632}
              height={300}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
