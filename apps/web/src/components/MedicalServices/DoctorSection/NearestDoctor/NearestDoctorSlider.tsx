"use client";

import React from "react";
import { useFindDoctor } from "@/hooks/healthCare/useDoctors";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

type Props = {
  className?: string;
  hideWhenEmpty?: boolean;
  wide?: boolean;
};

const NearestDoctorSlider = ({
  className = "",
  hideWhenEmpty = false,
  wide = false,
}: Props) => {
  const { nearestDoctorBanner: nearestDoctorsSlider } = useFindDoctor();

  if (hideWhenEmpty && !nearestDoctorsSlider?.length) return null;

  return (
    <div className={className}>
      <DoctorCommonSlider slider={nearestDoctorsSlider} wide={wide} />
    </div>
  );
};

export default NearestDoctorSlider;
