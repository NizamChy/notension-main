"use client";

import React from "react";
import { useSelector } from "react-redux";

const BookedAppointment = () => {
  const { bookedAppoinmentInfo } = useSelector((state) => state.user);

  console.log("bookedAppoinmentInfo", bookedAppoinmentInfo);

  return (
    <div className="min-h-content container">
      <div>
        <p className="md:text-2xl font-semibold py-5 text-[#0C3F8E] text-center">
          অ্যাপয়েন্টমেন্টের তালিকা
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {bookedAppoinmentInfo?.map((appoinment) => (
            <div
              key={appoinment?._id}
              className="border shadow-md rounded-lg mt-3"
            >
              <div className="text-primary font-medium px-4 py-2 space-y-1">
                <p>রোগীর নাম: {appoinment?.patient_info?.patient_name}</p>

                <p>
                  তারিখ: {appoinment?.appointment_date} -{" "}
                  {appoinment?.appointment_day}
                </p>

                <p>পরামর্শের সময়: {appoinment?.time_slot}</p>

                <p>সিরিয়াল নম্বর: {appoinment?.serial_no}</p>
              </div>

              <div className="text-[#A93356] bg-[#EDF7EF] font-semibold p-4 rounded-b-lg space-y-1">
                <p>{appoinment?.doctor_name}</p>
                <p>{appoinment?.doctor_speciality}</p>
                <p>{appoinment?.consultation_center_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookedAppointment;
