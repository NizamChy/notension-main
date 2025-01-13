"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";

const DoctorSlider = () => {
  const images = [
    "/images/medical-services/doctor-slider1-img1.jpg",
    "/images/medical-services/doctor-slider1-img2.jpg",
    "/images/medical-services/doctor-slider1-img3.jpg",
    "/images/medical-services/doctor-slider1-img4.jpg",
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
        className="mySwiper z-50 relative max-w-[800px] rounded-lg"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              className="object-cover w-full"
              src={image}
              alt={`Slide ${index + 1}`}
              width={800}
              height={400}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DoctorSlider;
