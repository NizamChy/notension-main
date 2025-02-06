"use client";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { useAppointment } from "@/hooks/fetch-data/useAppointment";

const AppointmentModalDetails = ({ selectedPatient, onClose }) => {
  const [timeSlot, setTimeSlot] = useState("");
  const [Available_Booking_Day, setAvailable_Booking_Day] = useState("");

  const today = new Date();

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const currentDate = today.toLocaleDateString("en-GB", options);

  const { getProfileOfDoctor } = useDoctor();
  const {
    message,
    progressing,
    setProgressing,
    bookAppointment,
    showErrorMessage,
    showSuccessMessage,
    isAppointmentBooked,
    setShowErrorMessage,
    setShowSuccessMessage,
  } = useAppointment();

  const { currentDoctor } = useSelector((state) => state.doctorInfo);

  const weekday = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const weekday_bangla = [
    "শনিবার",
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
  ];

  // let bookAppoinmentData = {
  //   doctor_info: currentDoctor?.doctorInfo?._id,
  //   doctor_name: currentDoctor?.doctorInfo?.doctor_name,
  //   consultation_center_name:
  //     currentDoctor?.consultationCenterInfo?.center_name,
  //   doctor_speciality: currentDoctor?.doctorInfo?.speciality,
  //   consultation_limit: currentDoctor?.consultation_limit_per_slot,
  //   consultation_center_info: currentDoctor?.consultationCenterInfo?._id,

  //   time_slot: "",
  //   appointment_day: "",
  //   appointment_date: "",

  //   patient_info: {
  //     id: selectedPatient?._id,
  //     patient_name: selectedPatient?.patient_name,
  //   },
  // };

  const formatAMPM = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const strMinutes = minutes.toString().padStart(2, "0");
    const strHours = hours.toString().padStart(2, "0");
    return `${strHours}:${strMinutes} ${ampm}`;
  };

  const isTimeInSlot = (current_time, slot_start, slot_end) => {
    const convertTo24Hour = (str) => {
      const [time, period] = str.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    };

    const time = convertTo24Hour(current_time);
    const slotStart = convertTo24Hour(slot_start);
    const slotEnd = convertTo24Hour(slot_end);
    return time >= slotStart && time <= slotEnd;
  };

  let current_day_name = weekday[(today.getDay() + 1) % 7];
  const appointmentDays = [];
  const CurrentDay = new Date(today.setDate(today.getDate()));
  const formattedDate = CurrentDay.toISOString().split("T")[0];
  const formattedTime = formatAMPM(CurrentDay);
  const [appointment_date, setAppointment] = useState(formattedDate);

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    currentDoctor?.chamber_schedule?.map((day, i) => {
      if (
        !day?.is_closed &&
        currentDoctor?.appointment_scheduling?.scheduling_type ==
          "ScheduleForNextDay"
      ) {
        appointmentDays.push(day?.day_name);
      }
    });
  }, []);

  const getNextAppointmentDay = (currentDay) => {
    const today = new Date();
    const currentIndex = weekday.indexOf(currentDay);
    for (let i = 0; i <= 6; i++) {
      const nextIndex = (currentIndex + i) % 7;
      if (appointmentDays.includes(weekday[nextIndex])) {
        const appointmetDate = new Date(today.setDate(today.getDate() + i));
        const formattedDate = appointmetDate.toISOString().split("T")[0];
        setAppointment(formattedDate);
        return weekday[nextIndex];
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      currentDoctor?.chamber_schedule?.map((day, i) => {
        if (
          !day?.is_closed &&
          currentDoctor?.appointment_scheduling?.scheduling_type ==
            "ScheduleForNextDay"
        ) {
          const nextAppointmentDay = getNextAppointmentDay(current_day_name);
          setAvailable_Booking_Day(nextAppointmentDay);
        } else if (
          !day?.is_closed &&
          currentDoctor?.appointment_scheduling?.scheduling_type ===
            "ScheduleForSameDay" &&
          day?.day_name === current_day_name
        ) {
          setAvailable_Booking_Day(day?.day_name);
        }
      });
    }, 1000);
  }, []);

  console.log("timeSlot : ", timeSlot);
  console.log("selected patient : ", selectedPatient);
  console.log("appointment_date : ", appointment_date);
  // console.log("bookAppoinmentData : ", bookAppoinmentData);
  console.log("Available_Booking_Day : ", Available_Booking_Day);

  const handleBookAppointment = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!timeSlot) {
      toast.info("Please select a time slot!", {
        position: "top-center",
      });
      return;
    }

    if (
      !isTimeInSlot(
        formattedTime,
        currentDoctor?.appointment_scheduling?.start_time,
        currentDoctor?.appointment_scheduling?.end_time
      )
    ) {
      toast.info(
        `Appointment time ${currentDoctor?.appointment_scheduling?.start_time} -${currentDoctor?.appointment_scheduling?.end_time} `,
        {
          position: "top-center",
        }
      );
      return;
    }

    let bookAppoinmentData = {
      doctor_info: currentDoctor?.doctorInfo?._id,
      doctor_name: currentDoctor?.doctorInfo?.doctor_name,
      consultation_center_name:
        currentDoctor?.consultationCenterInfo?.center_name,
      doctor_speciality: currentDoctor?.doctorInfo?.speciality,
      consultation_limit: currentDoctor?.consultation_limit_per_slot,
      consultation_center_info: currentDoctor?.consultationCenterInfo?._id,

      time_slot: timeSlot,

      appointment_day: Available_Booking_Day,
      appointment_date: appointment_date,

      patient_info: {
        id: selectedPatient?._id,
        patient_name: selectedPatient?.patient_name,
      },
    };

    bookAppointment(bookAppoinmentData);

    if (!progressing) {
      onClose();
    }

    console.log("bookAppoinmentData : ", bookAppoinmentData);
  };

  return (
    <>
      <div className="border border-primary rounded-lg p-4 my-5 shadow-md hover:shadow-lg transition-shadow duration-300">
        <p className="mb-1">তারিখ: {currentDate}</p>

        <p className="mb-4">
          সিরিয়াল নেওয়ার সময়:{" "}
          {currentDoctor?.appointment_scheduling?.start_time} -{" "}
          {currentDoctor?.appointment_scheduling?.end_time}
        </p>

        <p className="text-lg font-semibold text-primary">
          রোগীর নাম: {selectedPatient?.patient_name}
        </p>
        <p className="text-deepGray">
          মোবাইল নাম্বার: {selectedPatient?.contact}
        </p>

        <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
          {currentDoctor?.doctorInfo?.doctor_name}
        </h3>

        <div className="mt-1 mb-2">
          <p className="text-xs md:text-sm line-clamp-4 text-mediumGray">
            {currentDoctor?.doctorInfo?.qualifications}
          </p>
        </div>

        <div className="bg-[#CCB8F7] mt-3 py-1 w-full">
          <p className="line-clamp-1 w-full text-white font-semibold text-sm md:text-base px-3">
            {currentDoctor?.doctorInfo?.speciality}
          </p>
        </div>

        <div className="w-full mt-2">
          <p className="font-semibold text-primary">পরামর্শ কেন্দ্র:</p>

          <p className="text-[#599E66] text-xm md:text-lg font-semibold">
            {currentDoctor?.consultationCenterInfo?.center_name}
          </p>
        </div>

        <div className="mt-2">
          {/* <p className="mb-4">
            Appointment Time:{" "}
            {currentDoctor?.appointment_scheduling?.start_time} -{" "}
            {currentDoctor?.appointment_scheduling?.end_time}
          </p>
          <p className="mb-4">
            Appointment Date: {formatDate(appointment_date)}
          </p> */}
          <p className="font-semibold text-primary">পরামর্শের সময়:</p>

          {currentDoctor?.chamber_schedule?.map((day, i) => (
            <div className="mt-1" key={i}>
              {Available_Booking_Day !== "" &&
                day?.day_name === Available_Booking_Day && (
                  <div>
                    <label className="block text-[#A93356] font-semibold">
                      {formatDate(appointment_date)} - {day?.day_name} {""}(
                      {weekday_bangla[weekday.indexOf(day?.day_name)]})
                    </label>
                    <div className="mt-2">
                      {day?.morning?.start?.slice(0, 5) !== "00:00" && (
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="radio-buttons-group"
                            value={`${day?.morning?.start} - ${day?.morning?.end}`}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="form-radio"
                          />
                          <span className="ml-2">{`${day?.morning?.start} - ${day?.morning?.end}`}</span>
                        </label>
                      )}
                      {day?.afternoon?.start?.slice(0, 5) !== "00:00" && (
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="radio-buttons-group"
                            value={`${day?.afternoon?.start} - ${day?.afternoon?.end}`}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="form-radio"
                          />
                          <span className="ml-2">{`${day?.afternoon?.start} - ${day?.afternoon?.end}`}</span>
                        </label>
                      )}
                      {day?.evening?.start?.slice(0, 5) !== "00:00" && (
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="radio-buttons-group"
                            value={`${day?.evening?.start} - ${day?.evening?.end}`}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="form-radio"
                          />
                          <span className="ml-2">{`${day?.evening?.start} - ${day?.evening?.end}`}</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}
            </div>
          ))}
          <div className="mt-4">
            <button
              onClick={(e) => handleBookAppointment(e)}
              type="button"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
              disabled={progressing}
            >
              {/* Book Appointment */}
              {progressing ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentModalDetails;
