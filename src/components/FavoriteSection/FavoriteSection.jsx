"use client";

import "swiper/css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CARD, CARD_HOVER } from "@/components/shared/UI/UI";

const NAV_BUTTON =
  "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 md:flex";

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
    <div className="relative mx-auto mt-3 flex w-full items-center justify-center md:mt-4">
      <button
        type="button"
        aria-label="Previous"
        className={`${NAV_BUTTON} left-0`}
        id="custom-prev"
      >
        <HiChevronLeft className="text-lg" />
      </button>
      <button
        type="button"
        aria-label="Next"
        className={`${NAV_BUTTON} right-0`}
        id="custom-next"
      >
        <HiChevronRight className="text-lg" />
      </button>

      <div className="mx-auto flex w-full items-center justify-center md:px-14">
        <Swiper
          slidesPerView={2.4}
          spaceBetween={12}
          loop={true}
          navigation={{
            prevEl: "#custom-prev",
            nextEl: "#custom-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          modules={[Navigation]}
          className="mx-auto w-full !py-1"
        >
          {items.map((item) => (
            <SwiperSlide key={item.link} className="!h-auto">
              <Link
                href={item.link}
                className={`${CARD} ${CARD_HOVER} flex h-full flex-col items-center justify-start p-3 text-center md:p-4`}
              >
                <span className="flex h-14 w-full items-center justify-center rounded-xl bg-[#FFFFFF] p-1 md:h-16">
                  <Image
                    src={item.src}
                    alt=""
                    width={130}
                    height={64}
                    className="h-full w-auto max-w-[130px] object-contain"
                  />
                </span>
                <span className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-gray-900 md:text-sm">
                  {item.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FavoriteSection;
