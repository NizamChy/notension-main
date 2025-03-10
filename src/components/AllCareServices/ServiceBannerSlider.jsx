"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { SERVICE_BANNER_IMAGES } from "@/api-endpoints/api-endpoint";

const ServiceBannerSlider = ({ slider }) => {
  return (
    <>
      {slider?.length > 0 && (
        <div>
          <Swiper
            style={{
              "--swiper-pagination-color": "#EB5C2F",
              "--swiper-pagination-bullet-size": "12px",
              "--swiper-pagination-bullet-horizontal-gap": "6px",
              "--swiper-pagination-bullet-inactive-opacity": "1",
              "--swiper-pagination-bullet-inactive-color": "#FFF",
            }}
            loop={true}
            slidesPerView={1}
            spaceBetween={30}
            autoplay={{ delay: 3000 }}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            modules={[Keyboard, Pagination, Autoplay]}
            className="mySwiper z-50 relative w-full max-w-[800px] rounded-lg"
          >
            {slider?.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  className="object-cover w-full"
                  src={`${SERVICE_BANNER_IMAGES}/${image}`}
                  alt="service banner"
                  width={800}
                  height={400}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
};

export default ServiceBannerSlider;
