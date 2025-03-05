"use client";

import "swiper/css";
import React from "react";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import {
  SERVICE_BANNER_IMAGES,
  SERVICE_PROVIDER_IMAGES,
} from "@/api-endpoints/api-endpoint";

const ServicesSlider = ({ slider }) => {
  console.log("Slider from ServicesSlider : ", slider);

  const images = [
    "/images/all-care-services/services-slider-1.jpg",
    "/images/all-care-services/services-slider-2.jpg",
    "/images/all-care-services/services-slider-3.webp",
    "/images/all-care-services/services-slider-4.jpg",
    "/images/all-care-services/services-slider-1.jpg",
    "/images/all-care-services/services-slider-2.jpg",
    "/images/all-care-services/services-slider-3.webp",
    "/images/all-care-services/services-slider-4.jpg",
  ];
  console.log(slider.length);

  return (
    <>
      {slider.length && (
        <div className="py-0 md:py-5 lg:py-20">
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
                {/* IMAGE_URL = https://we-care-base.sgp1.cdn.digitaloceanspaces.com  */}

                {/* SERVICE_PROVIDER_IMAGES = `${IMAGE_URL}/service_provider` */}

                {/* src={`${HEALTH_CARE_IMAGES}/${service?.file_name}`}  */}

                {/* https://we-care-base.sgp1.cdn.digitaloceanspaces.com/service_provider/1733130022148-475675436.jpg */}

                {slider?.map((slide) => (
                  <SwiperSlide key={slide?._id} className="flex justify-center">
                    <div className="lg:m-3 cursor-pointer">
                      <Image
                        className="rounded-md shadow-lg"
                        src={`${SERVICE_BANNER_IMAGES}/${slide?.file_name}`}
                        alt={slide?.file_name}
                        width={420}
                        height={280}
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {/* {images.map((image, index) => (
                  <SwiperSlide key={index} className="flex justify-center">
                    <div className="lg:m-3 cursor-pointer">
                      <Image
                        className="rounded-md shadow-lg"
                        src={image}
                        alt="Services Area"
                        width={420}
                        height={280}
                      />
                    </div>
                  </SwiperSlide>
                ))} */}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesSlider;
