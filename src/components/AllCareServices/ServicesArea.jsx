"use client";

import React from "react";
import Loader from "../common/Loader";
import ServiceCard from "./ServiceCard";
import { useSelector } from "react-redux";

const ServicesArea = ({
  sliceEnd = 4,
  sliceStart = 0,
  imageWidth = 600,
  imageHeight = 300,
  bgClassName = "bg-[#F3F7FB]",
  imageKey = "service_banner_app",
  title = "Your Trusted Partner for Every Service",
  gridClassName = "grid grid-cols-2 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center",
}) => {
  const { allServicesInfo, isLoading } = useSelector((state) => state.allCare);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {allServicesInfo?.length > sliceStart ? (
            <div>
              <div
                className={`p-4 md:p-8 lg:p-10 ${bgClassName} rounded-xl`}
              >
                <div>
                  <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6 text-[#0C3F8E] text-center">
                    {title}
                  </h2>

                  <div className={gridClassName}>
                    {allServicesInfo
                      ?.slice(sliceStart, sliceEnd)
                      ?.map((service) => (
                        <ServiceCard
                          key={service?._id}
                          service={service}
                          imageKey={imageKey}
                          imageWidth={imageWidth}
                          imageHeight={imageHeight}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default ServicesArea;
