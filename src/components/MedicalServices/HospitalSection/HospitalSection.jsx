"use client";

import React from "react";
import CenterDistrictListing from "../Layout/CenterDistrictListing";

const HospitalSection = () => {
  return (
    <CenterDistrictListing
      centerType="Hospital"
      heroHref="/medical-services/hospital/nearest-hospital"
      heroImage="/images/medical-services/find-near-hospital.jpg"
      heroAlt="Find nearest hospital"
    />
  );
};

export default HospitalSection;
