"use client";

import "swiper/css";
import "swiper/css/navigation";
import React, { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import PopularDoctorSliderCard from "./PopularDoctorSliderCard";

const VisitedPopularDoctorSlider = ({
  popularDoctors,
  startValue = 0,
  endValue = 5,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
      {popularDoctors?.length > startValue ? (
        <div className="py-0 md:py-5 lg:py-10">
          <p className="md:text-2xl ps-5 font-semibold pb-1 md:pb-5 text-[#0C3F8E]">
            জনপ্রিয় বিশেষজ্ঞ
          </p>

          <div className="relative w-full flex justify-center items-center">
            <button
              ref={prevRef}
              className="hidden md:block absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:text-white text-[#0C3F8E] hover:bg-primary transition-all duration-300"
            >
              <GrPrevious />
            </button>

            <button
              ref={nextRef}
              className="hidden md:block absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:text-white text-[#0C3F8E] hover:bg-primary transition-all duration-300"
            >
              <GrNext />
            </button>

            <div className="w-full flex justify-center mx-auto ps-3 md:px-5 items-center">
              <Swiper
                slidesPerView={1.2}
                spaceBetween={20}
                loop={true}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
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
                    slidesPerView: 3.4,
                    spaceBetween: 30,
                  },
                }}
                modules={[Navigation]}
                className="w-full"
              >
                {popularDoctors?.slice(startValue, endValue)?.map((doctor) => (
                  <SwiperSlide key={doctor?._id}>
                    <PopularDoctorSliderCard doctor={doctor} isVisited={true} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default VisitedPopularDoctorSlider;
