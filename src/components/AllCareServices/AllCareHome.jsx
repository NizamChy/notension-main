"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import ServicesArea from "@/components/AllCareServices/ServicesArea";
import ServicesSlider from "@/components/AllCareServices/ServicesSlider";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";
import AllCareServices from "@/components/AllCareServices/AllCareServices";

const AllCareHome = () => {
  const [popularInfo, setPopularInfo] = useState([]);
  const [nearestInfo, setNearestInfo] = useState([]);

  const { exploreAllCareService, exploreCareProvider } = useAllCareService();
  const { careSlider, allServicesInfo } = useSelector((state) => state.allCare);

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (allServicesInfo?.length < 1) {
      exploreAllCareService();
    }
  }, []);

  // serviceId,
  // setPopularInfo,
  // setNearestInfo,
  // pageNo

  // useEffect(() => {
  //   exploreCareProvider(
  //     "673f16a13ba159242af8eb83",
  //     setPopularInfo,
  //     setNearestInfo,
  //     1
  //   );
  // }, []);

  // console.log("careSlider : ", careSlider);
  // console.log(userLatitude, userLongitude, districtId);

  // console.log("popularInfo : ", popularInfo);
  // console.log("nearestInfo : ", nearestInfo);

  console.log("allServicesInfo : ", allServicesInfo);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto min-h-content pt-20">
        <AllCareServices />

        <ServicesSlider slider={careSlider[0]?.first_slider} />

        <ServicesArea
          sliceEnd={4}
          sliceStart={0}
          imageWidth={600}
          imageHeight={300}
          bgClassName="bg-[#FEEFEA]"
          imageKey="service_banner_app"
          title="Your Trusted Partner for Every Service"
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
        />

        <ServicesSlider slider={careSlider[0]?.second_slider} />

        <ServicesArea
          sliceEnd={16}
          sliceStart={4}
          imageWidth={300}
          imageHeight={300}
          bgClassName="bg-[#FFF3FF]"
          imageKey="service_banner_app"
          title="One Platform, Endless Solutions!"
          gridClassName="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5"
        />

        <ServicesSlider slider={careSlider[0]?.third_slider} />

        <ServicesArea
          sliceEnd={20}
          sliceStart={16}
          imageWidth={300}
          imageHeight={300}
          bgClassName="bg-[#F2FCE4]"
          imageKey="service_banner_app"
          title="Learn, Grow, Succeed with Us!"
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
        />

        <ServicesSlider slider={careSlider[0]?.fourth_slider} />

        <ServicesArea
          sliceEnd={24}
          sliceStart={20}
          imageWidth={300}
          imageHeight={300}
          bgClassName="bg-[#FFFCEB]"
          imageKey="service_banner_app"
          title="Building Skills, Shaping Futures"
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
        />

        <ServicesSlider slider={careSlider[0]?.fifth_slider} />

        <ServicesArea
          sliceEnd={33}
          sliceStart={24}
          imageWidth={300}
          imageHeight={300}
          bgClassName="bg-[#DEF9EC]"
          imageKey="service_banner_app"
          title="All-in-One Service at Your Fingertips!"
          gridClassName="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5"
        />

        <ServicesSlider slider={careSlider[0]?.sixth_slider} />

        <ServicesArea
          sliceEnd={39}
          sliceStart={33}
          imageWidth={300}
          imageHeight={300}
          bgClassName="bg-[#FEEFEA]"
          imageKey="service_banner_app"
          title="Expert Help, Anytime!"
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
        />

        <ServicesSlider slider={careSlider[0]?.seventh_slider} />

        <ServicesArea
          sliceEnd={45}
          sliceStart={39}
          imageWidth={300}
          imageHeight={300}
          bgClassName="bg-[#FFF5E1D9]"
          imageKey="service_banner_app"
          title="Connecting You to Expert Services!"
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
        />
      </div>
    </>
  );
};

export default AllCareHome;
