import React from "react";
import Image from "next/image";
import Link from "next/link";

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

          <div className="absolute bottom-10 left-8">
            <h3
              className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Grocery Store
            </h3>
            <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
              + Shop Now
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

          <div className="absolute bottom-10 left-8">
            <h3
              className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Find Doctors
            </h3>
            <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
              + Book Appointment
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopLeftSection;
