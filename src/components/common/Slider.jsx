"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import { FOOD_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
import Image from "next/image";

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
          // className="mySwiper z-50 relative"
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

{
  /* <Swiper
  style={{
    "--swiper-pagination-color": "#3C8DE6",
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
  className="mySwiper z-50 relative"
>
  {DashboardSlider[0]?.first_slider.map((slide) => (
    <SwiperSlide
      key={slide._id}
      // className="lg:px-[65px] md:px-4 lg:mt-0 md:mt-28"
    >
      <div
      // className="xl:p-0 lg:p-0 md:p-0 px-4"
      >
        <Image
          // className="w-full xl:h-[380px] lg:h-[380px] md:h-[284px] h-[145px] object-cover xl:rounded-[20px] lg:rounded-3xl md:rounded-[35px] rounded-2xl"
          className="w-full max-w-full h-auto object-cover rounded-lg"
          // src={`${process.env.NEXT_PUBLIC_SERVER}/files/${slide.image}`}
          src={`${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${slide?.file_name}`}
          alt={`Slide ${slide?.file_name}`}
          width={1000}
          height={1000}
        />
      </div>
    </SwiperSlide>
  ))}
</Swiper>; */
}
