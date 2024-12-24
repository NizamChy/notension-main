"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const CategoryBannerCarousel = () => {
  const images = [
    "/png/food-banner.png",
    "/png/food-banner-2.png",
    "/png/food-banner-3.png",
  ];

  return (
    <div className="px-2">
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
        className="mySwiper z-50 relative w-full max-h-[240px] md:max-h-[400px] rounded-lg"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index} className="rounded-lg">
            <Image
              className="w-full max-w-full h-auto object-cover rounded-lg"
              src={slide}
              alt={`Slide ${index + 1}`}
              width={1000}
              height={1000}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryBannerCarousel;

// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useSelector } from "react-redux";

// const CategoryBannerCarousel = () => {
//   const DashboardSlider = useSelector(
//     (state) => state.dashboard.DashboardSlider
//   );

//   console.log("DashboardSlider", DashboardSlider);

//   // const visitedGroceryStore = useSelector(
//   //   (state) => state.dashboard.visitedGroceryStore
//   // );

//   // console.log(visitedGroceryStore);

//   const images = [
//     "/png/food-banner.png",
//     "/png/food-banner-2.png",
//     "/png/food-banner-3.png",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <>
//       <div className="flex justify-center relative m-2 md:m-3 mt-4">
//         <div className="lg:min-h-80 relative overflow-hidden rounded-lg">
//           <div
//             className="carousel-content flex transition-transform duration-500"
//             style={{
//               transform: `translateX(-${currentIndex * 100}%)`,
//             }}
//           >
//             {images.map((src, index) => (
//               <div key={index} className="carousel-slide flex-shrink-0 w-full">
//                 <Image
//                   src={src}
//                   alt={`banner-${index}`}
//                   width={800}
//                   height={300}
//                   className="rounded-lg w-full md:h-[350px] object-cover h-[150px]"
//                 />
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={prevSlide}
//             className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
//           >
//             &#10094;
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
//           >
//             &#10095;
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CategoryBannerCarousel;
