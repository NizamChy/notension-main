"use client";

import React from "react";
import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const ExploreConsultationCenterInfo = () => {
  const { currentCenter } = useSelector((state) => state.doctorInfo);

  console.log("currentCenter Hello:", currentCenter);

  return (
    <div className="">
      <div className="m-4 lg:flex gap-5 bg-white border rounded-lg shadow-md overflow-hidden cursor-pointer mt-5">
        <div className="p-2 md:p-4">
          <Image
            src={
              currentCenter?.medical_center_banner_app
                ? `${HEALTH_CARE_IMAGES}/${currentCenter?.medical_center_banner_app}`
                : "/png/dummyImage.png"
            }
            width={640}
            height={320}
            alt={currentCenter?.center_name}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div className="flex flex-col justify-center space-y-1 pt-0 lg:pt-4 p-2 md:p-4">
          <h3 className="text-lg md:text-base lg:text-2xl font-semibold text-[#A93356] lg:mb-2">
            {currentCenter?.center_name}
          </h3>

          <p className="flex gap-1 items-start text-sm md:text-lg lg:text-xl text-deepGray pb-1 lg:pb-4">
            <span>
              <FaLocationDot className="text-primary mt-1" />
            </span>
            <span className="line-clamp-4">{currentCenter?.address}</span>
          </p>

          {[1, 2, 3].map((index) => {
            const contact = currentCenter?.[`apointment_contact_${index}`];
            return (
              contact && (
                <p
                  key={index}
                  className="flex items-center gap-2 font-medium text-base md:text-lg lg:text-xl text-primary"
                >
                  <span>
                    <IoCall className="text-primary" />
                  </span>
                  <span>{contact}</span>
                </p>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreConsultationCenterInfo;
