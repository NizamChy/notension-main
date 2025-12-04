"use client";

import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const FavouriteDoctorProfile = () => {
  const [profileInfo, setProfileInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getProfileOfDoctor, progressing } = useDoctor();

  const router = useRouter();
  const params = useParams();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const doctorId = params?.id || null;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBookAppointment = (e, profile) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DOCTOR_INFO",
        data: profile,
      })
    );

    if (!userInfo?._id) {
      return openModal();
    } else {
      router.push("/medical-services/doctor/book-appointment");
    }
  };

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
            <div className="relative md:flex items-center lg:gap-20 text-deepGray lg:border border-slate-200 rounded-lg">
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

              <div className="md:w-1/2 rounded-lg">
                {profileInfo.map((profile) => (
                  <div
                    key={profile?._id}
                    className="p-4 lg:m-4 mt-3 md:mt-0 border border-primary rounded-lg"
                  >
                    <p className="text-primary font-bold text-lg md:text-xl">
                      পরামর্শ কেন্দ্র:
                    </p>
                    <p className="py-1 md:text-lg font-semibold text-primary">
                      {profile?.consultationCenterInfo?.center_name}
                    </p>
                    <p className="flex items-start gap-2 pt-1">
                      <span>
                        <FaLocationDot className="mt-1 text-primary" />
                      </span>
                      <span className="text-sm md:text-base font-medium pe-5">
                        {profile?.consultationCenterInfo?.address}
                      </span>
                    </p>

                    {profile?.chamber_onDay_time_slot_1 && (
                      <p className="text-primary font-bold text-lg md:text-xl mt-4 pb-1">
                        পরামর্শের সময়:
                      </p>
                    )}

                    {[1, 2, 3].map((index) => {
                      const timeSlot =
                        profile?.[`chamber_onDay_time_slot_${index}`];
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

                    {profile?.book_an_appointment && (
                      <button
                        onClick={(e) => handleBookAppointment(e, profile)}
                        className="mt-4 p-3 px-4 rounded-lg bg-primary text-white flex items-center justify-center gap-2"
                      >
                        <span>
                          <FaCalendarAlt className="text-lg" />
                        </span>
                        <span>Book an appointment</span>
                      </button>
                    )}

                    {profile?.consultationCenterInfo?.apointment_contact_1 && (
                      <p className="text-primary font-bold text-lg md:text-xl mt-4 pb-1">
                        সিরিয়ালের জন্য:
                      </p>
                    )}

                    {[1, 2, 3].map((index) => {
                      const contact =
                        profile?.consultationCenterInfo?.[
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
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="appointment" />
        </CommonModal>
      )}
    </>
  );
};

export default FavouriteDoctorProfile;
