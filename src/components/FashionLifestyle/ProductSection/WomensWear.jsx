"use client";

import React from "react";
import { WOMEN_TYPE_ID } from "../utils/constants";
import PopularTypeSection from "./PopularTypeSection";

const WomensWear = () => (
  <PopularTypeSection
    typeId={WOMEN_TYPE_ID}
    title="Women's Fashion Collection"
    errorText="Failed to load womens products"
  />
);

export default WomensWear;
