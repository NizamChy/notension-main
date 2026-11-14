"use client";

import React from "react";
import ServiceCard from "./ServiceCard";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/shared/UI/UI";

const GRID =
  "grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 lg:gap-5";

// One titled group of service tiles: a slice of the district's service list.
const ServicesArea = ({
  sliceEnd = 4,
  sliceStart = 0,
  title = "Your Trusted Partner for Every Service",
}) => {
  const { allServicesInfo, isLoading } = useSelector((state) => state.allCare);

  // While loading, only the first group shows placeholders.
  if (isLoading) {
    if (sliceStart > 0) return null;
    return (
      <section aria-busy="true">
        <Skeleton className="mb-5 h-7 w-64 max-w-full" />
        <div className={GRID}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="mx-auto mt-2 h-3.5 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const services = allServicesInfo?.slice(sliceStart, sliceEnd) || [];
  if (!services.length) return null;

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3 md:mb-6">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-2xl">
          {title}
        </h2>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
          {services.length} {services.length === 1 ? "service" : "services"}
        </span>
      </div>

      <div className={GRID}>
        {services.map((service) => (
          <ServiceCard key={service?._id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default ServicesArea;
