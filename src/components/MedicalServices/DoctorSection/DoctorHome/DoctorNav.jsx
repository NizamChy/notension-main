"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const DoctorNav = () => {
  const [slider, setSlider] = useState([]);
  const { findDoctorBanner } = useSelector((state) => state.doctorInfo);

  useEffect(() => {
    if (findDoctorBanner && findDoctorBanner.length > 2) {
      setSlider(findDoctorBanner.slice(3, findDoctorBanner.length));
    }
  }, [findDoctorBanner]);

  return (
    <>
      {slider?.length > 0 && (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center gap-5 py-4 lg:py-0">
            <div>
              <Link href="/medical-services/doctor/nearest-doctor">
                <Image
                  src={`${HEALTH_CARE_IMAGES}/${slider[0]?.file_name}`}
                  alt="Find Nearest Doctor"
                  width={400}
                  height={400}
                  className="w-full lg:max-w-[400px] rounded-lg shadow-md hover:shadow-lg"
                />
              </Link>
            </div>
            <div>
              <Link href="/medical-services/doctor/consultation-center">
                <Image
                  src={`${HEALTH_CARE_IMAGES}/${slider[1]?.file_name}`}
                  alt="consultation-center"
                  width={400}
                  height={400}
                  className="w-full lg:max-w-[400px] rounded-lg shadow-md hover:shadow-lg"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorNav;
