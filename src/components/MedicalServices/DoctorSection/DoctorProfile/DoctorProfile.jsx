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

  console.log("profileInfo: ", profileInfo);

  return (
    <>
      {progressing ? (
        <Loader />
      ) : (
        <div className="container min-h-content">
          <div>
            <div className="md:flex items-center gap-20 text-deepGray">
              <div className="lg:flex items-center md:w-1/2">
                <div className="md:w-1/3">
                  <Image
                    src={
                      profileInfo[0]?.doctorInfo?.gender === "Female"
                        ? "/images/medical-services/doctor-female.png"
                        : "/images/medical-services/doctor-male.jpg"
                    }
                    alt="Popular doctor"
                    width={207}
                    height={207}
                    className="object-cover md:w-full rounded-lg mx-auto"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="mt-3 text-lg font-semibold text-[#A93356]">
                    {profileInfo[0]?.doctorInfo?.doctor_name}
                  </h3>

                  <p className="text-xs md:text-base text-mediumGray my-1 line-clamp-4">
                    {profileInfo[0]?.doctorInfo?.qualifications}
                  </p>

                  <p className="text-lg font-bold text-primary">
                    {profileInfo[0]?.doctorInfo?.speciality}
                  </p>
                </div>
              </div>
              <div className="md:w-1/2">
                <div>
                  <p className="text-primary font-bold text-xl">
                    পরামর্শ কেন্দ্র:
                  </p>
                  <p className="text-sm md:text-lg font-semibold">
                    {profileInfo[0]?.consultationCenterInfo?.center_name}
                  </p>
                  <p className="flex items-start gap-2">
                    <FaLocationDot className="mt-1" />
                    {profileInfo[0]?.consultationCenterInfo?.address}
                  </p>
                  <p className="text-primary font-bold text-xl mt-4">
                    পরামর্শের সময়:
                  </p>
                  {[1, 2, 3].map((index) => {
                    const timeSlot =
                      profileInfo[0]?.[`chamber_onDay_time_slot_${index}`];
                    return (
                      timeSlot && (
                        <p key={index} className="flex items-center gap-2">
                          <MdAccessTimeFilled />
                          {timeSlot}
                        </p>
                      )
                    );
                  })}

                  <p className="text-primary font-bold text-xl mt-4">
                    সিরিয়ালের জন্য:
                  </p>

                  {[1, 2, 3].map((index) => {
                    const contact =
                      profileInfo[0]?.consultationCenterInfo?.[
                        `apointment_contact_${index}`
                      ];
                    return (
                      contact && (
                        <p key={index} className="flex items-center gap-2">
                          <IoCall />
                          {contact}
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
