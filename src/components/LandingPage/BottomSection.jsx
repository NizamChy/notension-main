import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BsTelephone } from "react-icons/bs";

const APP_URL =
  "https://play.google.com/store/apps/details?id=com.bitsnotension";

const CARDS = [
  { title: "Find Nurse", image: "/images/home/home-banner-9.webp" },
  { title: "Find Ambulance", image: "/images/home/home-banner-10.webp" },
  { title: "Find Blood Donor", image: "/images/home/home-banner-11.webp" },
];

// Stacked on phones (three columns made the labels unreadably small),
// three across from `sm` up.
const BottomSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 w-full">
      {CARDS.map(({ title, image }) => (
        <Link key={title} href={APP_URL} prefetch={false} target="_blank">
          <div className="group overflow-hidden relative">
            <Image
              width={416}
              height={350}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              src={image}
              alt={title}
            />

            <div className="absolute bottom-3 left-3 md:bottom-10 md:left-8">
              <h3 className="text-lg sm:text-sm md:text-xl lg:text-2xl font-semibold tracking-wide lg:tracking-widest text-gray-500">
                {title}
              </h3>
              <p className="flex items-center gap-1 text-sm sm:text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <BsTelephone className="text-xs md:text-sm text-mediumGray" />
                <span>Contact Now</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BottomSection;
