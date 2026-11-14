"use client";

import React from "react";
import { useSelector } from "react-redux";
import DoctorCarousel from "./DoctorCarousel";

const PopularDoctorSlider = ({
  startValue = 0,
  endValue = 5,
  title,
  subtitle,
}) => {
  const { popularDoctors, isLoading } = useSelector(
    (state) => state.doctorInfo
  );

  // The page shows a single loader while doctor data loads.
  if (isLoading || !(popularDoctors?.length > startValue)) return null;

  return (
    <DoctorCarousel
      doctors={popularDoctors.slice(startValue, endValue)}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default PopularDoctorSlider;
