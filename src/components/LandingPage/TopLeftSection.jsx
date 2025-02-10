import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LuCalendarDays, LuShoppingCart } from "react-icons/lu";

const TopLeftSection = () => {
  return (
    <div className="space-y-4">
      <Link href="/grocery/all">
        <div className="group overflow-hidden relative">
          <Image
            width={632}
            height={463}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-1.webp"
            alt="home-banner-1"
          />

          <div className="absolute bottom-10 left-4 md:bottom-10 md:left-8">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Grocery Store
            </h3>
            <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <LuShoppingCart className="text-sm md:text-lg text-mediumGray" />
              </span>
              <span>Shop Now</span>
            </p>
          </div>
        </div>
      </Link>

      <div className="group overflow-hidden relative">
        <Link href="/medical-services/doctor">
          <Image
            width={632}
            height={300}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-3.webp"
            alt="home-banner-3"
          />

          <div className="absolute bottom-5 left-3 md:bottom-10 md:left-8">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Find Doctors
            </h3>
            <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <LuCalendarDays className="text-sm md:text-lg text-mediumGray" />
              </span>
              <span>Book Appointment</span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopLeftSection;
