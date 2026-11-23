"use client";

import React from "react";
import CenterDistrictListing from "../Layout/CenterDistrictListing";

const DentalCareCenter = () => {
  return (
    <CenterDistrictListing
      centerType="Deltal Care Centre"
      heroHref="/medical-services/dental-care-center/nearest-dental-care-center"
      heroImage="/images/medical-services/find-near-dental-care-center.jpg"
      heroAlt="Find nearest dental care center"
      listTitle="Dental care in your district"
      emptyTitle="No dental care centres found in your district"
    />
  );
};

export default DentalCareCenter;
