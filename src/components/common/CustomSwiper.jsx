// // components/CustomSwiper.js
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Keyboard, Pagination, Autoplay } from "swiper";
// import Image from "next/image";
// import "swiper/css";
// import "swiper/css/pagination";

// const CustomSwiper = ({
//   images = [], // Array of image objects { src, alt }
//   slidesPerView = 1,
//   loop = true,
//   spaceBetween = 30,
//   autoplayDelay = 3000,
//   showPagination = true,
//   paginationClickable = true,
//   swiperStyles = {},
//   imageStyles = "",
//   className = "",
// }) => {
//   return (
//     <Swiper
//       style={{
//         "--swiper-pagination-color": "#3C8DE6",
//         "--swiper-pagination-bullet-inactive-color": "#FFF",
//         "--swiper-pagination-bullet-inactive-opacity": "1",
//         "--swiper-pagination-bullet-size": "12px",
//         "--swiper-pagination-bullet-horizontal-gap": "6px",
//         ...swiperStyles, // Allow additional inline styles
//       }}
//       slidesPerView={slidesPerView}
//       loop={loop}
//       spaceBetween={spaceBetween}
//       autoplay={autoplayDelay ? { delay: autoplayDelay } : undefined}
//       keyboard={{ enabled: true }}
//       pagination={showPagination ? { clickable: paginationClickable } : false}
//       modules={[Keyboard, Pagination, Autoplay]}
//       className={`mySwiper z-50 relative ${className}`}
//     >
//       {images.map((image, index) => (
//         <SwiperSlide key={index}>
//           <div>
//             <Image
//               className={`w-full max-w-full h-auto object-cover rounded-lg ${imageStyles}`}
//               src={image.src}
//               alt={image.alt || `Slide ${index}`}
//               width={1000}
//               height={1000}
//             />
//           </div>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };

// export default CustomSwiper;
