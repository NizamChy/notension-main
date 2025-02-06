"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";

const PopularDoctorSliderCard = ({ doctor }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentDoctor } = useSelector((state) => state.doctorInfo);

  const handleDoctorClick = (e, doctor) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DOCTOR_INFO",
        data: doctor,
      })
    );

    console.log("doctor : ", doctor);
    console.log("currentDoctor : ", currentDoctor);

    // router.push(`/medical-services/doctor/profile/${doctor?.doctorInfo?._id}`);
    router.push("/medical-services/doctor/profile");
  };

  return (
    <div
      onClick={(e) => handleDoctorClick(e, doctor)}
      className="bg-white w-full min-h-60 md:min-h-72 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2"
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
        <div className="w-2/3 flex flex-col justify-start items-start">
          <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
            {doctor?.doctorInfo?.doctor_name}
          </h3>

          <p className="text-xs md:text-sm text-mediumGray my-1 line-clamp-4">
            {doctor?.doctorInfo?.qualifications}
          </p>
        </div>
      </div>

      <div className="py-1 mt-4 px-3 bg-[#F78F1E] w-full">
        <p className="truncate w-full text-white font-semibold text-sm md:text-base line-clamp-1">
          {doctor?.doctorInfo?.speciality}
        </p>
      </div>

      <div className="w-full">
        <p className="my-2 text-[#0C3F8E] px-3 text-sm md:text-lg font-semibold">
          {doctor?.consultationCenterInfo?.center_name}
        </p>
      </div>
    </div>
  );
};

export default PopularDoctorSliderCard;
