"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { handleDoctorReducer } from "@/redux/doctorReducer";

const PopularDoctorSliderCard = ({ doctor, isVisited = false }) => {
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

    router.push(
      `/medical-services/doctor/consultation-center/visit/${centerId}/doctor-profile/${doctor?.doctorInfo?._id}`
    );
  };

  return (
    <div
      onClick={(e) => handleDoctorClick(e, doctor)}
      className="bg-white w-full min-h-60 flex flex-col justify-center items-center border rounded-2xl hover:border-primary shadow-sm cursor-pointer py-3 my-2 transition-all duration-300"
    >
      <div className="flex gap-2 px-2 lg:px-8 justify-center items-center">
        <div className="w-1/3">
          <Image
            src={
              doctor?.doctorInfo?.gender === "Female"
                ? "/images/medical-services/doctor-female.png"
                : "/images/medical-services/doctor-male.png"
            }
            alt="Popular doctor"
            width={110}
            height={140}
            className="object-cover w-full md:w-[110px] md:h-[140px]"
          />
        </div>
        <div className="space-y-2 w-2/3 flex flex-col justify-start items-start">
          <h3 className="mt-3 text-sm md:text-base font-semibold text-deepGray">
            {doctor?.doctorInfo?.doctor_name}
          </h3>

          <p className="text-xs md:text-sm font-medium text-[#A93356] line-clamp-1">
            {doctor?.doctorInfo?.speciality}
          </p>

          <p className="text-xs md:text-sm text-mediumGray my-1 line-clamp-3">
            {doctor?.doctorInfo?.qualifications}
          </p>
        </div>
      </div>

      {!isVisited && (
        <>
          <div className="w-full px-3 my-2">
            <p className="text-[#0C3F8E] text-sm md:text-lg font-semibold line-clamp-1 text-center">
              {doctor?.consultationCenterInfo?.center_name}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PopularDoctorSliderCard;
