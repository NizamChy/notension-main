import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoCallOutline, IoFastFoodOutline } from "react-icons/io5";

const TopRightSection = () => {
  return (
    <div className="space-y-4">
      <Link
        href="https://play.google.com/store/apps/details?id=com.bitsnotension"
        prefetch={false}
        target="_blank"
      >
        <div className="group overflow-hidden relative mt-4 lg:mt-0">
          <Image
            width={632}
            height={300}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/all-care-services.jpg"
            alt="home-banner-2"
          />

          <div className="absolute bottom-16 left-3 md:bottom-10 md:left-4">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              All Care Services
            </h3>
            <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <BsTelephone className="text-xs md:text-sm text-mediumGray" />
              </span>
              <span>Contact Now</span>
            </p>
          </div>
        </div>
      </Link>

      <div className="flex justify-center lg:gap-4">
        <Link href="/medicine/all">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={470}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/medicine-shop.jpg"
              alt="home-banner-4"
            />

            <div className="absolute bottom-4 left-4 md:bottom-10 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Medicine Store
              </h3>
              <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <MdOutlineShoppingBag className="text-sm md:text-lg text-mediumGray" />
                </span>
                <span>Shop Now</span>
              </p>
            </div>
          </div>
        </Link>

        <Link href="/food">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={470}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-5.webp"
              alt="home-banner-5"
            />

            <div className="absolute bottom-4 left-4 md:bottom-10 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Restaurant
              </h3>
              <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <IoFastFoodOutline className="text-sm md:text-lg text-mediumGray" />
                </span>
                <span>Order Now</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopRightSection;
