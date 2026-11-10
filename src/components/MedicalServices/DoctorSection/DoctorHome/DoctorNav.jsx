"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import React from "react";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const tiles = [
  { href: "/medical-services/doctor/nearest-doctor", alt: "Find Nearest Doctor" },
  { href: "/medical-services/doctor/consultation-center", alt: "Consultation Center" },
];

// Two shortcut tiles next to the doctor slider. On mobile they are squares;
// from md up they stretch to the slider's height so the row lines up.
const DoctorNav = () => {
  const { findDoctorBanner } = useSelector((state) => state.doctorInfo);

  // Banners after the first three are the two shortcut tiles.
  const slider = findDoctorBanner?.length > 2 ? findDoctorBanner.slice(3) : [];

  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-6">
      {tiles.map((tile, index) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="group relative block aspect-square md:aspect-auto md:h-full rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          {slider[index]?.file_name && (
            <Image
              src={`${HEALTH_CARE_IMAGES}/${slider[index].file_name}`}
              alt={tile.alt}
              fill
              sizes="(min-width: 1280px) 310px, (min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          )}
        </Link>
      ))}
    </div>
  );
};

export default DoctorNav;
