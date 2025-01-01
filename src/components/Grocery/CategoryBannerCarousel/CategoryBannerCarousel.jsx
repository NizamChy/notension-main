"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
import Image from "next/image";
import { useSelector } from "react-redux";

const CategoryBannerCarousel = () => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  return (
    <>
      <div>
        {DashboardSlider[0]?.second_slider?.length && (
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
            className="mySwiper z-50 relative max-h-[240px] md:max-h-[400px] rounded-lg w-full"
          >
            {DashboardSlider[0]?.first_slider?.map((slide) => (
              <SwiperSlide key={slide._id} className="rounded-lg">
                <Image
                  className="w-full max-w-full h-auto object-cover rounded-lg"
                  src={`${GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES}/${slide?.file_name}`}
                  alt={`Slide ${slide?.file_name}`}
                  width={1000}
                  height={1000}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default CategoryBannerCarousel;
