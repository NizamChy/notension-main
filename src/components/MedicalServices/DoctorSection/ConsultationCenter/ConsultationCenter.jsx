"use client";

import React from "react";
import ConsultationCenterSlider from "./ConsultationCenterSlider";
import CenterDistrictListing from "../../Layout/CenterDistrictListing";

const ConsultationCenter = () => {
  return (
    <CenterDistrictListing
      centerType="Consultation Center"
      heroHref="/medical-services/doctor/consultation-center/nearest-center"
      heroImage="/images/medical-services/find-near-consultation.jpg"
      heroAlt="Find nearest consultation center"
      sliderNode={<ConsultationCenterSlider />}
    />
  );
};

export default ConsultationCenter;
