"use client";

import React from "react";
import CenterDistrictListing from "../Layout/CenterDistrictListing";

const EyeCareCenter = () => {
  return (
    <CenterDistrictListing
      centerType="Eye Care Centre"
      heroHref="/medical-services/eye-care-center/nearest-eye-care-center"
      heroImage="/images/medical-services/find-near-eye-care-center.jpg"
      heroAlt="Find nearest eye care center"
    />
  );
};

export default EyeCareCenter;
