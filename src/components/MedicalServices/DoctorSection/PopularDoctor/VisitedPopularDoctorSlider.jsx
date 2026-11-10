"use client";

import React from "react";
import DoctorCarousel from "./DoctorCarousel";

const VisitedPopularDoctorSlider = ({
  popularDoctors,
  startValue = 0,
  endValue = 5,
}) => {
  if (!(popularDoctors?.length > startValue)) return null;

  return (
    <DoctorCarousel
      doctors={popularDoctors.slice(startValue, endValue)}
      isVisited={true}
    />
  );
};

export default VisitedPopularDoctorSlider;
