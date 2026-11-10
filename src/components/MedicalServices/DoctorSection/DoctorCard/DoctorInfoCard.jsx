"use client";

import React from "react";
import DoctorCardView from "./DoctorCardView";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { handleDoctorReducer } from "@/redux/doctorReducer";

const DoctorInfoCard = ({ doctor, isVisited = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useParams();
  // visit/[id] names the param `id`, dept/[deptId]/center/[centerId] names
  // it `centerId`; otherwise fall back to the doctor's own center.
  const centerId =
    params?.id ||
    params?.centerId ||
    doctor?.consultationCenterInfo?._id ||
    null;

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
      centerId
        ? `/medical-services/doctor/consultation-center/visit/${centerId}/doctor-profile/${doctor?.doctorInfo?._id}`
        : `/medical-services/doctor/profile/${doctor?.doctorInfo?._id}`
    );
  };

  return (
    <DoctorCardView
      onClick={(e) => handleDoctorClick(e, doctor)}
      name={doctor?.doctorInfo?.doctor_name}
      gender={doctor?.doctorInfo?.gender}
      speciality={doctor?.doctorInfo?.speciality}
      qualifications={doctor?.doctorInfo?.qualifications}
      footer={isVisited ? null : doctor?.consultationCenterInfo?.center_name}
    />
  );
};

export default DoctorInfoCard;
