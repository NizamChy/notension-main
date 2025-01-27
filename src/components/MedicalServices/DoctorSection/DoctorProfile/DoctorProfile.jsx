"use client";

import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";

const DoctorProfile = () => {
  const [profileInfo, setProfileInfo] = useState([]);

  const { getProfileOfDoctor, progressing } = useDoctor();

  const params = useParams();

  const doctorId = params?.id || null;

  useEffect(() => {
    getProfileOfDoctor(doctorId, setProfileInfo);
  }, []);

  return (
    <>
      {progressing ? (
        <Loader />
      ) : (
        <div className="container min-h-content">
          <div>
            <div className="md:flex items-center lg:gap-20 text-deepGray">
              <div className="lg:flex items-center md:w-1/2">
                <div className="md:w-1/3">
                  <Image
                    src={
                      profileInfo[0]?.doctorInfo?.gender === "Female"
                        ? "/images/medical-services/doctor-female.png"
                        : "/images/medical-services/doctor-male.png"
                    }
                    alt="Popular doctor"
                    width={200}
                    height={300}
                    className="object-cover rounded-lg mx-auto"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="mt-3 text-lg lg:text-xl xl:text-2xl font-semibold text-[#A93356]">
                    {profileInfo[0]?.doctorInfo?.doctor_name}
                  </h3>

                  <p className="text-sm lg:text-base text-mediumGray my-1">
                    {profileInfo[0]?.doctorInfo?.qualifications}
                  </p>

                  <p className="text-lg lg:text-xl font-bold text-primary py-1">
                    {profileInfo[0]?.doctorInfo?.speciality}
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 mt-3 md:mt-0 md:border-0 md:p-0 border border-primary rounded-lg p-3">
                <div>
                  <p className="text-primary font-bold text-lg md:text-xl">
                    পরামর্শ কেন্দ্র:
                  </p>
                  <p className="py-1 md:text-lg font-semibold text-primary">
                    {profileInfo[0]?.consultationCenterInfo?.center_name}
                  </p>
                  <p className="flex items-start gap-2 pt-1">
                    <span>
                      <FaLocationDot className="mt-1 text-primary" />
                    </span>
                    <span className="text-sm md:text-base font-medium">
                      {profileInfo[0]?.consultationCenterInfo?.address}
                    </span>
                  </p>

                  {profileInfo[0]?.chamber_onDay_time_slot_1 && (
                    <p className="text-primary font-bold text-lg md:text-xl mt-4 pb-1">
                      পরামর্শের সময়:
                    </p>
                  )}

                  {[1, 2, 3].map((index) => {
                    const timeSlot =
                      profileInfo[0]?.[`chamber_onDay_time_slot_${index}`];
                    return (
                      timeSlot && (
                        <p
                          key={index}
                          className="flex items-start font-medium gap-2 text-[#A93356]"
                        >
                          <span>
                            <MdAccessTimeFilled className="mt-1 text-primary" />
                          </span>
                          <span className="text-sm md:text-base">
                            {timeSlot}
                          </span>
                        </p>
                      )
                    );
                  })}

                  {profileInfo[0]?.consultationCenterInfo
                    ?.apointment_contact_1 && (
                    <p className="text-primary font-bold text-lg md:text-xl mt-4 pb-1">
                      সিরিয়ালের জন্য:
                    </p>
                  )}

                  {[1, 2, 3].map((index) => {
                    const contact =
                      profileInfo[0]?.consultationCenterInfo?.[
                        `apointment_contact_${index}`
                      ];
                    return (
                      contact && (
                        <p
                          key={index}
                          className="flex items-center gap-2 font-medium"
                        >
                          <span>
                            <IoCall className="text-primary" />
                          </span>
                          <span>{contact}</span>
                        </p>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorProfile;
