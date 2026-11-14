"use client";

import React from "react";
import NearestCenterListing from "../Layout/NearestCenterListing";

const NearestEyeCare = () => (
  <NearestCenterListing
    centerType="Eye Care Centre"
    title="Eye care near you"
    back="/medical-services/eye-care-center"
    backLabel="All eye care centres"
  />
);

export default NearestEyeCare;
