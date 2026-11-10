"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { WiTime4 } from "react-icons/wi";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { toLocalYMD } from "@/utils/date";
import {
  MedicalCardGrid,
  MedicalContainer,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";

const BookedAppointment = () => {
  const dispatch = useDispatch();
  const { bookedAppoinmentInfo } = useSelector((state) => state.user);

  const banglaDays = [
    "শনিবার",
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
  ];

  const englishDays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const getBanglaDay = (englishDay) => {
    const index = englishDays.indexOf(englishDay);
    return banglaDays[index];
  };

  const formatDate = (date) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];

    return { day, month };
  };

  useEffect(() => {
    const currentDate = toLocalYMD();
    const pastAppointments = bookedAppoinmentInfo.filter(
      (appointment) =>
        new Date(appointment?.appointment_date).getTime() <
        new Date(currentDate).getTime()
    );

    if (pastAppointments?.length > 0) {
      pastAppointments?.forEach((appointment) => {
        dispatch(
          handleUserReducer({
            type: "UPDATE_BOOKED_APPOINTMENT_INFO",
            data: {
              action: "delete",
              appoinmentData: appointment,
            },
          })
        );
      });
    }
  }, [bookedAppoinmentInfo, dispatch]);

  const DateCard = ({ date }) => {
    const { day, month } = formatDate(date);
    return (
      <div className="shrink-0 flex flex-col items-center justify-center w-16 h-20 bg-[#1F7A8C] text-white rounded-lg">
        <span className="text-2xl font-bold">{day}</span>
        <span className="text-base">{month}</span>
      </div>
    );
  };

  return (
    <MedicalContainer className="py-6 md:py-8">
      <div>
        {bookedAppoinmentInfo?.length > 0 && (
          <MedicalSectionTitle className="text-center">
            অ্যাপয়েন্টমেন্টের তালিকা
          </MedicalSectionTitle>
        )}

        {bookedAppoinmentInfo?.length < 1 && (
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <Image
              className="max-w-md w-full h-auto"
              src="/images/medical-services/no-appointment-found.png"
              alt="no-appointment-found"
              width={1024}
              height={1024}
            />
          </div>
        )}

        <MedicalCardGrid className="xl:grid-cols-4">
          {[...bookedAppoinmentInfo]
            ?.slice()
            ?.reverse()
            ?.map((appointment) => (
              <div
                key={appointment?._id}
                className="h-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div className="text-primary font-medium p-4 space-y-1">
                  <div className="flex items-center gap-3">
                    <DateCard date={appointment?.appointment_date} />

                    <div className="min-w-0 text-sm space-y-0.5">
                      <p>
                        {" "}
                        <span className="text-mediumGray">রোগীর নাম:</span>{" "}
                        {appointment?.patient_info?.patient_name}
                      </p>
                      <p className="font-semibold text-secondaryMedicine">
                        সিরিয়াল নম্বর: {appointment?.serial_no}
                      </p>
                      <p>
                        {appointment?.appointment_day} (
                        {getBanglaDay(appointment?.appointment_day)})
                      </p>
                    </div>
                  </div>

                  <p className="flex items-start gap-1 pt-2">
                    <span>
                      <WiTime4 className="text-2xl text-secondaryMedicine" />
                    </span>
                    <span className="font-medium">
                      <span className="text-mediumGray">পরামর্শের সময়:</span>{" "}
                      {appointment?.time_slot}
                    </span>
                  </p>
                </div>

                <div className="text-[#A93356] text-base bg-[#EDF7EF] font-semibold p-4 space-y-1">
                  <p className="line-clamp-1">{appointment?.doctor_name}</p>
                  <p className="text-sm text-primary line-clamp-1">
                    {appointment?.doctor_speciality}
                  </p>
                  <p className="text-base text-secondaryMedicine line-clamp-1">
                    {appointment?.consultation_center_name}
                  </p>
                </div>
              </div>
            ))}
        </MedicalCardGrid>
      </div>
    </MedicalContainer>
  );
};

export default BookedAppointment;
