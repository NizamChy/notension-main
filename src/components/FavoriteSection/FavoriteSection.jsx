"use client";

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { GrPrevious, GrNext } from "react-icons/gr";
import Link from "next/link";

const FavoriteSection = () => {
  const items = [
    {
      src: "/images/favorite/130X64-01.png",
      name: "Favorite Grocery Shop",
      link: "/grocery/all",
    },
    {
      src: "/images/favorite/130X64-02.png",
      name: "Medicine Shop",
      link: "/medicine/all",
    },
    {
      src: "/images/favorite/130X64-04.png",
      name: "Favorite Food & Restaurant",
      link: "/food",
    },
    {
      src: "/images/favorite/130X64-03.png",
      name: "Favorite Doctors",
      link: "#",
    },
    {
      src: "/images/favorite/130X64-05.png",
      name: "Favorite Consultation Center",
      link: "#",
    },
  ];
  // const items = [
  //   {
  //     src: "/images/favorite/doctors.png",
  //     name: "Favorite Doctors",
  //     link: "#",
  //   },
  //   {
  //     src: "/images/favorite/grocery-shop.png",
  //     name: "Favorite Grocery Shop",
  //     link: "/grocery/all",
  //   },
  //   {
  //     src: "/images/favorite/medicine-shop.png",
  //     name: "Medicine Shop",
  //     link: "/medicine/all",
  //   },
  //   {
  //     src: "/images/favorite/food-restaurant.png",
  //     name: "Favorite Food & Restaurant",
  //     link: "/food",
  //   },
  //   {
  //     src: "/images/favorite/consultation-center.png",
  //     name: "Favorite Consultation Center",
  //     link: "#",
  //   },
  // ];

  return (
    <div className="container max-w-screen-xl mx-auto mt-5 mb-1 relative flex justify-center items-center">
      <button
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-prev"
      >
        <GrPrevious />
      </button>
      <button
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-next"
      >
        <GrNext />
      </button>

      <div className="w-full flex justify-center mx-auto px-5 items-center">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          navigation={{
            prevEl: "#custom-prev",
            nextEl: "#custom-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          modules={[Navigation]}
          className="w-full mx-auto"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <Link href={item.link}>
                <div
                  className={`bg-white w-full max-w-lg flex flex-col justify-center items-center rounded-lg cursor-pointer`}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={130}
                    height={64}
                    className="rounded object-contain"
                  />
                  <p className="text-sm md:text-base font-semibold text-deepGray text-center">
                    {item.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FavoriteSection;

// "use client";

// import Image from "next/image";
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
// import { GrPrevious, GrNext } from "react-icons/gr";

// const FavoriteSection = () => {
//   // const images = [
//   //   "/images/favorite/favorite-doctors.jpg",
//   //   "/images/favorite/favorite-grocery.jpg",
//   //   "/images/favorite/favorite-medicine.jpg",
//   //   "/images/favorite/favorite-restaurant.jpg",
//   //   "/images/favorite/favorite-consults.jpg",
//   // ];
//   const images = [
//     "/images/favorite/doctors.png",
//     "/images/favorite/grocery-shop.png",
//     "/images/favorite/medicine-shop.png",
//     "/images/favorite/food-restaurant.png",
//     "/images/favorite/consultation-center.png",
//     "/images/favorite/consultation-center.png",
//     "/images/favorite/consultation-center.png",
//   ];
//   // const images = [
//   //   "/images/favorite/Favorite slider_FAVORITE DOCTOR.jpg",
//   //   "/images/favorite/Favorite slider_FAVORITE GROCERY.jpg",
//   //   "/images/favorite/Favorite slider_FAVORITE MEDICINE.jpg",
//   //   "/images/favorite/Favorite slider_FAVORITE FOOD & RESTAURANT.jpg",
//   //   "/images/favorite/Favorite slider-05.jpg",
//   // ];

//   return (
//     <div className="container max-w-screen-xl mx-auto mt-5 mb-1 relative flex justify-center items-center">
//       <button
//         className="absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
//         id="custom-prev"
//       >
//         <GrPrevious />
//       </button>
//       <button
//         className="absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
//         id="custom-next"
//       >
//         <GrNext />
//       </button>

//       <div className="w-full flex justify-center mx-auto px-5 items-center">
//         <Swiper
//           slidesPerView={3}
//           spaceBetween={20}
//           loop={true}
//           navigation={{
//             prevEl: "#custom-prev",
//             nextEl: "#custom-next",
//           }}
//           breakpoints={{
//             640: {
//               slidesPerView: 3,
//               spaceBetween: 20,
//             },
//             1024: {
//               slidesPerView: 5,
//               spaceBetween: 20,
//             },
//           }}
//           modules={[Navigation]}
//           className="w-full mx-auto"
//         >
//           {images.map((image, index) => (
//             <SwiperSlide key={index} className="flex justify-center">
//               <div
//                 className={`bg-white w-full max-w-lg flex flex-col justify-center items-center rounded-lg cursor-pointer`}
//               >
//                 <Image
//                   src={image}
//                   alt="favorite items"
//                   width={300}
//                   height={200}
//                   className="rounded w-full h-16 object-contain"
//                 />

//                 <p className="font-semibold text-deepGray text-center">
//                   Favorite Doctors
//                 </p>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };

// export default FavoriteSection;
