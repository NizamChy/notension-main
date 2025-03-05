"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ServicesArea from "@/components/AllCareServices/ServicesArea";
import ServicesSlider from "@/components/AllCareServices/ServicesSlider";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";
import AllCareServices from "@/components/AllCareServices/AllCareServices";

const AllCareHome = () => {
  const { exploreAllCareService } = useAllCareService();
  const { careSlider, allServicesInfo } = useSelector((state) => state.allCare);

  useEffect(() => {
    if (allServicesInfo?.length < 1) {
      exploreAllCareService();
    }
  }, []);

  console.log("careSlider : ", careSlider);
  console.log("careSlider[0]?.first_slider : ", careSlider[0]?.first_slider);
  console.log("allServicesInfo : ", allServicesInfo);
  console.log("allServicesInfo?.length : ", allServicesInfo?.length);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto min-h-content pt-20">
        <AllCareServices />
        <ServicesArea />
        <ServicesSlider slider={careSlider[0]?.first_slider} />
        <ServicesArea />
        <ServicesSlider slider={careSlider[0]?.second_slider} />
        <ServicesArea />
        <ServicesSlider slider={careSlider[0]?.third_slider} />
      </div>
    </>
  );
};

export default AllCareHome;
