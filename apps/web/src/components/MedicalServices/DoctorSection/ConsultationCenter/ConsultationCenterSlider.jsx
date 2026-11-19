"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const ConsultationCenterSlider = () => {
  const [slider, setSlider] = useState([]);

  const consultationCenterBanner = useSelector(
    (state) => state.doctorInfo.consultationCenterBanner
  );

  useEffect(() => {
    if (consultationCenterBanner && consultationCenterBanner.length > 1) {
      setSlider(
        consultationCenterBanner.slice(0, consultationCenterBanner.length - 1)
      );
    }
  }, [consultationCenterBanner]);

  return (
    <>
      <DoctorCommonSlider slider={slider} />
    </>
  );
};

export default ConsultationCenterSlider;
