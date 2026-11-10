"use client";

import "swiper/css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";

const FavoriteSection = () => {
  const items = [
    {
      src: "/images/favorite/favorite-doctors.png",
      name: "Favorite Doctors",
      link: "/medical-services/favorite-doctor",
    },
    {
      src: "/images/favorite/favorite-consultation.png",
      name: "Favorite Consultation Center",
      link: "/medical-services/favorite-consultation",
    },
    {
      src: "/images/favorite/favorite-grocery.png",
      name: "Favorite Grocery Store",
      link: "/grocery/favorite-stores",
    },
    {
      src: "/images/favorite/favorite-medicine.png",
      name: "Favorite Medicine Shop",
      link: "/medicine/favorite-stores",
    },
    {
      src: "/images/favorite/favorite-food.png",
      name: "Favorite Food & Restaurant",
      link: "/food/store/favorite-stores",
    },
  ];

  return (
    <div className="w-full bg-white mx-auto mt-3 md:mt-4 relative flex justify-center items-center">
      <button
        className="hidden md:block absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-prev"
      >
        <GrPrevious />
      </button>
      <button
        className="hidden md:block absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-next"
      >
        <GrNext />
      </button>

      <div className="w-full flex justify-center mx-auto md:px-14 items-center">
        <Swiper
          slidesPerView={3.3}
          spaceBetween={12}
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
                  className={`bg-white w-full max-w-lg flex flex-col justify-start items-center rounded-lg cursor-pointer`}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={130}
                    height={64}
                    className="rounded object-contain w-full max-w-[130px] h-12 sm:h-14 md:h-16"
                  />
                  <p className="mt-1.5 text-[11px] leading-tight sm:text-xs md:text-base md:leading-snug font-semibold text-deepGray text-center line-clamp-2">

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
