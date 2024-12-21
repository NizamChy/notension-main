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

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
// import Slider from "@/components/common/Slider";

const CategoryBannerCarousel = () => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [sliderImages, setSliderImages] = useState([]);

  // const prevSlide = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1
  //   );
  // };

  // const nextSlide = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  // useEffect(() => {
  //   if (DashboardSlider?.length > 0) {
  //     const firstSlider = DashboardSlider[0]?.first_slider || [];
  //     const imagePaths = firstSlider.map(
  //       (item) => `${GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES}/${item.file_name}`
  //     );
  //     setSliderImages(imagePaths);
  //   }
  // }, [DashboardSlider]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) =>
  //       sliderImages.length > 0
  //         ? (prevIndex + 1) % sliderImages.length
  //         : prevIndex
  //     );
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [sliderImages]);

  return (
    <>
      <div>
        {DashboardSlider[0]?.first_slider?.length && (
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
            className="mySwiper z-50 relative max-h-[240px] md:max-h-[400px]"
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

      {/* <div className="flex justify-center relative">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="carousel-content flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {sliderImages.map((src, index) => (
              <div key={index} className="carousel-slide flex-shrink-0 w-full">
                <Image
                  src={src}
                  alt={`banner-${index}`}
                  width={800}
                  height={400}
                  className="rounded-lg w-full h-full object-cover md:h-[350px] lg:h-full"
                />
              </div>
            ))}
          </div>

          {sliderImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
              >
                &#10094;
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      </div> */}
    </>
  );
};

export default CategoryBannerCarousel;
