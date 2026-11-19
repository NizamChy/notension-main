"use client";

import React from "react";
import { useSelector } from "react-redux";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const NearestDoctorSlider = ({
  className = "",
  hideWhenEmpty = false,
  wide = false,
}) => {
  const nearestDoctorsSlider = useSelector(
    (state) => state.doctorInfo.nearestDoctorsSlider
  );

  if (hideWhenEmpty && !nearestDoctorsSlider?.length) return null;

  return (
    <div className={className}>
      <DoctorCommonSlider slider={nearestDoctorsSlider} wide={wide} />
    </div>
  );
};

export default NearestDoctorSlider;
