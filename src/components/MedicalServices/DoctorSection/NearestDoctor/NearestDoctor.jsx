"use client";

import Image from "next/image";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";

const NearestDoctor = () => {
  const [doctorsInfo, setDoctorsInfo] = useState(null);

  const { getNearestDoctorsInfo, progressing } = useDoctor();

  useEffect(() => {
    getNearestDoctorsInfo(setDoctorsInfo);
  }, []);

  return (
    <>
      {progressing ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-center px-4 lg:px-20 py-5 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center">
              {doctorsInfo?.map((doctor) => (
                <div key={doctor?._id} className="flex justify-center">
                  <div className="bg-white w-full min-h-60 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2">
                    <div className="flex gap-2 px-3 lg:px-8 justify-center items-center">
                      <div className="w-1/3">
                        <Image
                          src={
                            doctor?.doctorInfo?.gender === "Female"
                              ? "/images/medical-services/doctor-female.png"
                              : "/images/medical-services/doctor-male.jpg"
                          }
                          alt={doctor?.doctorInfo?.doctor_name || "Doctor"}
                          width={120}
                          height={120}
                          className="object-contain w-[86px] h-[86px] md:w-[120px] md:h-[120px] py-2"
                        />
                      </div>
                      <div className="w-2/3 flex flex-col justify-start items-start">
                        <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
                          {doctor?.doctorInfo?.doctor_name}
                        </h3>

                        <div className="mt-1 mb-2">
                          <p className="text-xs md:text-sm line-clamp-4 text-mediumGray">
                            {doctor?.doctorInfo?.qualifications}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#CCB8F7] py-1 w-full">
                      <p className="line-clamp-1 w-full text-white font-semibold text-sm md:text-base px-3">
                        {doctor?.doctorInfo?.speciality}
                      </p>
                    </div>

                    <div className="w-full">
                      <p className="my-2 text-[#599E66] px-3 text-xm md:text-lg font-semibold">
                        {doctor?.consultationCenterInfo?.center_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NearestDoctor;
