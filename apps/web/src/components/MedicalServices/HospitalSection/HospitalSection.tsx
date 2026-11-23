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
      listTitle="Hospitals in your district"
      emptyTitle="No hospitals found in your district"
    />
  );
};

export default HospitalSection;
