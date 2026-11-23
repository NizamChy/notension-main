"use client";

import React from "react";
import { useFindDoctor } from "@/hooks/healthCare/useDoctors";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const ConsultationCenterSlider = () => {
  const { consultationCenterBanner } = useFindDoctor();
  // The last banner is not part of the slider.
  const slider =
    consultationCenterBanner.length > 1
      ? consultationCenterBanner.slice(0, consultationCenterBanner.length - 1)
      : [];

  return (
    <>
      <DoctorCommonSlider slider={slider} />
    </>
  );
};

export default ConsultationCenterSlider;
