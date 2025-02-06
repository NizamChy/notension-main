"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DoctorInfoCard = ({ doctor }) => {
  const router = useRouter();

  const handleDoctorClick = (e, doctor) => {
    e.preventDefault();
    e.stopPropagation();

    // router.push(`/medical-services/doctor/profile/${doctor?.doctorInfo?._id}`);
    router.push("/medical-services/doctor/profile");
  };

  return (
    <div
      onClick={(e) => handleDoctorClick(e, doctor)}
      className="bg-white w-full min-h-60 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2"
    >
      <div className="flex gap-2 px-3 lg:px-8 justify-center items-center">
        <div className="w-1/3">
          <Image
            src={
              doctor?.doctorInfo?.gender === "Female"
                ? "/images/medical-services/doctor-female.png"
                : "/images/medical-services/doctor-male.png"
            }
            alt={doctor?.doctorInfo?.doctor_name || "Doctor"}
            width={110}
            height={140}
            className="object-cover w-full md:w-[110px] md:h-[140px]"
          />
        </div>
        <div className="w-2/3 flex flex-col justify-start items-start">
          <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
            {doctor?.doctorInfo?.doctor_name}
          </h3>

          <div className="mt-1 mb-2">
            <p className="text-xs md:text-sm line-clamp-4 text-mediumGray">
              {doctor?.doctorInfo?.qualifications}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#CCB8F7] mt-3 py-1 w-full">
        <p className="line-clamp-1 w-full text-white font-semibold text-sm md:text-base px-3">
          {doctor?.doctorInfo?.speciality}
        </p>
      </div>

      <div className="w-full">
        <p className="my-2 text-[#599E66] px-3 text-xm md:text-lg font-semibold">
          {doctor?.consultationCenterInfo?.center_name}
        </p>
      </div>
    </div>
  );
};

export default DoctorInfoCard;
