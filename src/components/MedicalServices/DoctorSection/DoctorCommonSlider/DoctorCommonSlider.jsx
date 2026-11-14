"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

// Banner slider used across Medical Services. It always reserves a fixed
// 2:1 box (the banners are 800x400), so the layout never jumps while the
// banners load and the pagination bullets can't float around on a 0-height
// slider (that was the stray red dot above the slider).
// `wide` is for a slider that spans the full page width: from md up it uses a
// 3:1 box so it isn't too tall. The banners keep their content in the middle
// band, so the crop doesn't cut it.
const DoctorCommonSlider = ({ slider, className = "", wide = false }) => {
  return (
    <div
      className={`relative w-full aspect-[2/1] ${
        wide ? "md:aspect-[3/1]" : ""
      } overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 ${className}`}
    >
      {slider?.length > 0 ? (
        <Swiper
          style={{
            "--swiper-pagination-color": "#EB5C2F",
            "--swiper-pagination-bullet-size": "8px",
            "--swiper-pagination-bullet-horizontal-gap": "5px",
            "--swiper-pagination-bullet-inactive-opacity": "0.7",
            "--swiper-pagination-bullet-inactive-color": "#FFF",
          }}
          slidesPerView={1}
          loop={slider.length > 2}
          rewind={slider.length === 2}
          spaceBetween={0}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          modules={[Keyboard, Pagination, Autoplay]}
          className="!absolute inset-0 w-full h-full"
        >
          {slider.map((image) => (
            <SwiperSlide
              key={image?._id || image?.file_name}
              className="relative"
            >
              <Image
                className="object-cover"
                src={`${HEALTH_CARE_IMAGES}/${image?.file_name}`}
                alt={image?.title || "Medical services banner"}
                fill
                sizes={
                  wide
                    ? "(min-width: 1280px) 1232px, 100vw"
                    : "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
                }
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      )}
    </div>
  );
};

export default DoctorCommonSlider;
