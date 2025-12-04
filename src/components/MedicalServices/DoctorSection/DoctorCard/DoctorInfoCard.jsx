"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { handleDoctorReducer } from "@/redux/doctorReducer";

const DoctorInfoCard = ({ doctor, isVisited = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useParams();
  const centerId = params?.id || null;

  const handleDoctorClick = (e, doctor) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DOCTOR_INFO",
        data: doctor,
      })
    );

    // router.push("/medical-services/doctor/profile");
    router.push(
      `/medical-services/doctor/consultation-center/visit/${centerId}/doctor-profile/${doctor?.doctorInfo?._id}`
    );
  };

  return (
    <div
      onClick={(e) => handleDoctorClick(e, doctor)}
      className="bg-white w-full min-h-60 flex flex-col justify-center items-center rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer py-3 my-2"
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

          <span className="mt-2 inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
            {doctor?.doctorInfo?.speciality}
          </span>

          <div className="my-2">
            <p className="text-xs md:text-sm line-clamp-3 text-mediumGray">
              {doctor?.doctorInfo?.qualifications}
            </p>
          </div>
        </div>
      </div>

      {!isVisited && (
        <div className="w-full px-3 my-2">
          <p className="text-primary text-xm md:text-lg font-semibold line-clamp-1 text-center">
            {doctor?.consultationCenterInfo?.center_name}
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorInfoCard;
