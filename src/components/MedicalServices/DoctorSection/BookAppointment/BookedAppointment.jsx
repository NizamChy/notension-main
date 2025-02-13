"use client";

import React from "react";
import { WiTime4 } from "react-icons/wi";
import { useSelector } from "react-redux";

const BookedAppointment = () => {
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

  const DateCard = ({ date }) => {
    const { day, month } = formatDate(date);
    return (
      <div className="flex flex-col items-center justify-center w-16 h-20 bg-[#1F7A8C] text-white rounded-lg">
        <span className="text-2xl font-bold">{day}</span>
        <span className="text-base">{month}</span>
      </div>
    );
  };

  return (
    <div className="container">
      <div>
        {bookedAppoinmentInfo?.length > 0 && (
          <p className="md:text-2xl font-semibold py-5 text-[#0C3F8E] text-center">
            অ্যাপয়েন্টমেন্টের তালিকা
          </p>
        )}

        {bookedAppoinmentInfo?.length < 1 && (
          <p className="text-center text-deepGray">No Appointment found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...bookedAppoinmentInfo]
            ?.slice()
            ?.reverse()
            ?.map((appointment) => (
              <div
                key={appointment?._id}
                className="border shadow-md rounded-lg mt-3 flex flex-col justify-between"
              >
                <div className="text-primary font-medium px-4 pt-4 pb-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <DateCard date={appointment?.appointment_date} />

                    <div className="text-sm space-y-0.5">
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

                <div className="text-[#A93356] text-base bg-[#EDF7EF] font-semibold p-4 rounded-b-lg space-y-1 px-6">
                  <p>{appointment?.doctor_name}</p>
                  <p className="text-sm text-primary">
                    {appointment?.doctor_speciality}
                  </p>
                  <p className="text-sm text-secondaryMedicine">
                    {appointment?.consultation_center_name}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BookedAppointment;
