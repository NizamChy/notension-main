"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdHomeRepairService } from "react-icons/md";
import { getAllCareServiceIcon } from "@/utils/allCareServiceIcon";
import type { CareService } from "@/lib/api/allCare";

type Props = { service: CareService };

// Service category tile: illustration on a soft tile, name underneath.
const ServiceCard = ({ service }: Props) => {
  const router = useRouter();
  const icon = getAllCareServiceIcon(service);

  const handleServiceClick = () => {
    router.push(`/all-care-services/service/${service?._id}`);
  };

  return (
    <button
      type="button"
      onClick={handleServiceClick}
      className="group flex h-full w-full flex-col items-center rounded-2xl p-1 text-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EB5C2F] sm:p-1.5"
    >
      <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#FFFFFF] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-gray-300 group-hover:shadow-lg group-hover:shadow-gray-900/5">
        {icon ? (
          <Image
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105 sm:p-2"
            src={icon}
            alt=""
            fill
            sizes="(min-width: 1024px) 180px, (min-width: 640px) 22vw, 30vw"
          />
        ) : (
          <MdHomeRepairService
            aria-hidden="true"
            className="h-1/2 w-1/2 text-primary/60"
          />
        )}
      </span>

      <span className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary dark:group-hover:text-[#7FB2FF] sm:text-sm/5">
        {service?.service_name_eng}
      </span>
    </button>
  );
};

export default ServiceCard;
