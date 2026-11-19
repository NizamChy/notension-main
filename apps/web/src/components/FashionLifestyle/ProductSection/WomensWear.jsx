"use client";

import React from "react";
import { WOMEN_TYPE_ID } from "../utils/constants";
import PopularTypeSection from "./PopularTypeSection";

const WomensWear = () => (
  <PopularTypeSection
    typeId={WOMEN_TYPE_ID}
    typeSlug="women"
    title="Women's collection"
    subtitle="Sarees, salwar kameez, kurtis and more"
    errorText="Failed to load womens products"
    className="bg-gray-50"
  />
);

export default WomensWear;
