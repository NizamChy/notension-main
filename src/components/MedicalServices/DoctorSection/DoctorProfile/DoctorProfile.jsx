"use client";

import Link from "next/link";
import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaCalendarAlt, FaHeart } from "react-icons/fa";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import { useRouter } from "next/navigation";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const DoctorProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();
  const { currentDoctor } = useSelector((state) => state.doctorInfo);

  let merchantType = 4;
  let isExists = null;

  const userInfo = useSelector((state) => state.user.userInfo);

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteList(currentDoctor?.doctorInfo, merchantType);
  };

  const handleBookAppointment = () => {
    if (!userInfo?._id) {
      return openModal();
    } else {
      router.push("/medical-services/doctor/book-appointment");
    }
  };

  useEffect(() => {
    isExists = isAddedToFavouriteList(
      currentDoctor?.doctorInfo?._id,
      merchantType
    );
    setIsFavoriteAdded(isExists);
  }, [currentDoctor, handleAddToFavorite]);

  return (
    <>
      <div className="container min-h-content">
        <div>
          <div className="relative md:flex items-center lg:gap-20 text-deepGray lg:border border-slate-200 py-20 rounded-lg">
            <div className="lg:flex items-center md:w-1/2">
              <div className="md:w-1/3">
                <Image
                  src={
                    currentDoctor?.doctorInfo?.gender === "Female"
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
                  {currentDoctor?.doctorInfo?.doctor_name}
                </h3>

                <p className="text-sm lg:text-base text-mediumGray my-1">
                  {currentDoctor?.doctorInfo?.qualifications}
                </p>

                <p className="text-lg lg:text-xl font-bold text-primary py-1">
                  {currentDoctor?.doctorInfo?.speciality}
                </p>
              </div>
            </div>
            <div className="md:w-1/2 mt-3 md:mt-0 md:border-0 md:p-0 border border-primary rounded-lg p-3">
              <div>
                <p className="text-primary font-bold text-lg md:text-xl">
                  পরামর্শ কেন্দ্র:
                </p>
                <p className="py-1 md:text-lg font-semibold text-primary">
                  {currentDoctor?.consultationCenterInfo?.center_name}
                </p>
                <p className="flex items-start gap-2 pt-1">
                  <span>
                    <FaLocationDot className="mt-1 text-primary" />
                  </span>
                  <span className="text-sm md:text-base font-medium pe-5">
                    {currentDoctor?.consultationCenterInfo?.address}
                  </span>
                </p>

                {currentDoctor?.chamber_onDay_time_slot_1 && (
                  <p className="text-primary font-bold text-lg md:text-xl mt-4 pb-1">
                    পরামর্শের সময়:
                  </p>
                )}

                {[1, 2, 3].map((index) => {
                  const timeSlot =
                    currentDoctor?.[`chamber_onDay_time_slot_${index}`];
                  return (
                    timeSlot && (
                      <p
                        key={index}
                        className="flex items-start font-medium gap-2 text-[#A93356]"
                      >
                        <span>
                          <MdAccessTimeFilled className="mt-1 text-primary" />
                        </span>
                        <span className="text-sm md:text-base">{timeSlot}</span>
                      </p>
                    )
                  );
                })}

                {currentDoctor?.book_an_appointment &&
                  !currentDoctor?.is_chamber_off && (
                    // <Link href="/medical-services/doctor/book-appointment">
                    <button
                      onClick={handleBookAppointment}
                      className="mt-4 p-3 px-4 rounded-lg bg-primary text-white flex items-center justify-center gap-2"
                    >
                      <span>
                        <FaCalendarAlt className="text-lg" />
                      </span>
                      <span>Book an appointment</span>
                    </button>
                    // </Link>
                  )}

                {currentDoctor?.consultationCenterInfo
                  ?.apointment_contact_1 && (
                  <p className="text-primary font-bold text-lg md:text-xl mt-4 pb-1">
                    সিরিয়ালের জন্য:
                  </p>
                )}

                {[1, 2, 3].map((index) => {
                  const contact =
                    currentDoctor?.consultationCenterInfo?.[
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

            {!isFavoriteAdded && (
              <button
                onClick={handleAddToFavorite}
                className="absolute top-8 right-3 md:right-6 text-deepGray bg-primaryBg opacity-65 hover:text-primaryFood border hover:border-primaryFood rounded-full hover:bg-white px-1 pe-2 flex justify-center items-center"
              >
                <FaHeart className="size-7 p-1 text-xl rounded-full text-primaryFood" />
                <span className="text-xs font-medium">Add to Favourite</span>
              </button>
            )}

            {isFavoriteAdded && (
              <button className="absolute top-8 right-3 md:right-6 opacity-65 rounded-full flex justify-center items-center">
                <FaHeart className="size-7 p-1 text-xl rounded-full text-primaryFood" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="appointment" />
        </CommonModal>
      )}
    </>
  );
};

export default DoctorProfile;
