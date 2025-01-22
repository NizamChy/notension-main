"use client";

import "swiper/css";
import React from "react";
import "swiper/css/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import Loader from "@/components/common/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";

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
          <div className="py-0 md:py-5 lg:py-20">
            <p className="md:text-2xl ps-5 font-semibold pb-1 md:pb-5 text-deepGray">
              জনপ্রিয় বিশেষজ্ঞ
            </p>

            <div className="relative flex justify-center items-center">
              <button
                className="hidden md:block absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
                id="custom-prev-doc"
              >
                <GrPrevious />
              </button>

              <button
                className="hidden md:block absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
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
                  {popularDoctors.slice(startValue, endValue).map((doctor) => (
                    <SwiperSlide
                      key={doctor._id}
                      className="flex justify-center"
                    >
                      <div className="bg-white w-full min-h-60 md:min-h-72 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2">
                        <div className="flex gap-2 px-2 lg:px-8 justify-center items-center">
                          <div className="w-1/3">
                            <Image
                              src={
                                doctor?.doctorInfo?.gender === "Female"
                                  ? "/images/medical-services/doctor-female.png"
                                  : "/images/medical-services/doctor-male.jpg"
                              }
                              alt="Popular doctor"
                              width={86}
                              height={86}
                              className="object-contain w-[86px] h-[86px] py-2"
                            />
                          </div>
                          <div className="w-2/3 flex flex-col justify-start items-start">
                            <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
                              {doctor?.doctorInfo?.doctor_name}
                            </h3>

                            <p className="text-xs md:text-sm text-mediumGray my-1 line-clamp-4">
                              {doctor?.doctorInfo?.qualifications}
                            </p>
                          </div>
                        </div>

                        <div className="py-1 bg-[#F78F1E] w-full">
                          <p className="truncate w-full text-white font-semibold text-sm md:text-base px-3 line-clamp-1">
                            {doctor?.doctorInfo?.speciality}
                          </p>
                        </div>

                        <div className="w-full">
                          <p className="my-2 text-[#0C3F8E] px-3 text-sm md:text-lg font-semibold">
                            {doctor?.consultationCenterInfo?.center_name}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PopularDoctorSlider;
