"use client";

import "swiper/css";
import React from "react";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import Loader from "@/components/common/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import PopularDoctorSliderCard from "./PopularDoctorSliderCard";

const PopularDoctorSlider = ({ startValue = 0, endValue = 5 }) => {
  const { popularDoctors, isLoading } = useSelector(
    (state) => state.doctorInfo
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {popularDoctors?.length > startValue ? (
            <div className="py-0 md:py-5 lg:py-10">
              <p className="md:text-2xl ps-5 font-semibold pb-1 md:pb-5 text-[#0C3F8E]">
                জনপ্রিয় বিশেষজ্ঞ
              </p>

              <div className="relative flex justify-center items-center">
                <button
                  className="hidden md:block absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-[#0C3F8E]"
                  id="custom-prev-doc"
                >
                  <GrPrevious />
                </button>

                <button
                  className="hidden md:block absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-[#0C3F8E]"
                  id="custom-next-doc"
                >
                  <GrNext />
                </button>

                <div className="w-full flex justify-center mx-auto ps-3 md:px-5 items-center">
                  <Swiper
                    slidesPerView={1.2}
                    spaceBetween={20}
                    loop={true}
                    navigation={{
                      prevEl: "#custom-prev-doc",
                      nextEl: "#custom-next-doc",
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
                        slidesPerView: 4,
                        spaceBetween: 30,
                      },
                    }}
                    modules={[Navigation]}
                    className="mx-auto"
                  >
                    {popularDoctors
                      .slice(startValue, endValue)
                      .map((doctor) => (
                        <SwiperSlide
                          key={doctor?._id}
                          className="flex justify-center"
                        >
                          <PopularDoctorSliderCard doctor={doctor} />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default PopularDoctorSlider;
