"use client";

import React from "react";
import { useFindDoctor } from "@/hooks/healthCare/useDoctors";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const NearestDoctorSlider = ({
  className = "",
  hideWhenEmpty = false,
  wide = false,
}) => {
  const { nearestDoctorBanner: nearestDoctorsSlider } = useFindDoctor();

  if (hideWhenEmpty && !nearestDoctorsSlider?.length) return null;

  return (
    <div className={className}>
      <DoctorCommonSlider slider={nearestDoctorsSlider} wide={wide} />
    </div>
  );
};

export default NearestDoctorSlider;
