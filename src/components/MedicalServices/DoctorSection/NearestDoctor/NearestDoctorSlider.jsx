"use client";

import React from "react";
import { useSelector } from "react-redux";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const NearestDoctorSlider = () => {
  const nearestDoctorsSlider = useSelector(
    (state) => state.doctorInfo.nearestDoctorsSlider
  );

  return (
    <>
      <DoctorCommonSlider slider={nearestDoctorsSlider} />
    </>
  );
};

export default NearestDoctorSlider;
