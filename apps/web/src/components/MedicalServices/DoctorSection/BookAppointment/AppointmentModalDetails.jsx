"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  LuBuilding2,
  LuCalendarCheck,
  LuCalendarDays,
  LuCheck,
  LuClock,
  LuUserRound,
} from "react-icons/lu";
import React, { useEffect, useState } from "react";
import { useAppointment } from "@/hooks/fetch-data/useAppointment";
import { toLocalYMD } from "@/utils/date";
import { Badge } from "@/components/shared/UI/UI";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import { DoctorAvatar } from "../../Layout/MedicalUI";

const SLOT_KEYS = [
  ["morning", "Morning"],
  ["afternoon", "Afternoon"],
  ["evening", "Evening"],
];

const AppointmentModalDetails = ({ selectedPatient, onClose }) => {
  const [timeSlot, setTimeSlot] = useState("");
  const [Available_Booking_Day, setAvailable_Booking_Day] = useState("");

  const today = new Date();

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const currentDate = today.toLocaleDateString("en-GB", options);

  const { progressing, bookAppointment } = useAppointment();
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

  const formatAMPM = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const strMinutes = minutes.toString().padStart(2, "0");
    const strHours = hours.toString().padStart(2, "0");
    return `${strHours}:${strMinutes} ${ampm}`;
  };

  let current_day_name = weekday[(today.getDay() + 1) % 7];
  const appointmentDays = [];
  const CurrentDay = new Date(today.setDate(today.getDate()));
  const formattedDate = toLocalYMD(CurrentDay);
  const formattedTime = formatAMPM(CurrentDay);
  const [appointment_date, setAppointment] = useState(formattedDate);

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

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    currentDoctor?.chamber_schedule?.map((day, i) => {
      if (
        !day?.is_closed &&
        currentDoctor?.appointment_scheduling?.scheduling_type ===
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
        const formattedDate = toLocalYMD(appointmetDate);
        setAppointment(formattedDate);
        return weekday[nextIndex];
      }
    }
  };

  // Work out the bookable day whenever the doctor's schedule is available.
  useEffect(() => {
    currentDoctor?.chamber_schedule?.forEach((day) => {
      if (
        !day?.is_closed &&
        currentDoctor?.appointment_scheduling?.scheduling_type ===
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDoctor]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!timeSlot) {
      toast("Please select a time slot!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
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
      toast(
        `Appointment time ${currentDoctor?.appointment_scheduling?.start_time} -${currentDoctor?.appointment_scheduling?.end_time} `,
        {
          style: {
            border: "1px solid #FC8F1E",
          },
          icon: "ℹ️",
          iconTheme: {
            primary: "#FC8F1E",
            secondary: "#FFFAEE",
          },
        }
      );
      return;
    }

    let appointmentData = {
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

    // Close only after the request has finished (success or failure).
    await bookAppointment(appointmentData);
    onClose();
  };

  const info = currentDoctor?.doctorInfo;
  const bookingDay =
    Available_Booking_Day !== ""
      ? currentDoctor?.chamber_schedule?.find(
          (day) => day?.day_name === Available_Booking_Day
        )
      : null;
  const slots = bookingDay
    ? SLOT_KEYS.filter(
        ([key]) =>
          bookingDay?.[key]?.start &&
          bookingDay?.[key]?.start?.slice(0, 5) !== "00:00"
      ).map(([key, label]) => ({
        label,
        value: `${bookingDay?.[key]?.start} - ${bookingDay?.[key]?.end}`,
      }))
    : [];

  return (
    <div className="max-h-[78vh] overflow-y-auto px-1">
      <h2 className="pr-6 text-lg font-bold tracking-tight text-gray-900">
        Confirm appointment
      </h2>
      <p className="mt-0.5 text-xs text-gray-500">
        তারিখ: {currentDate} · Serial booking{" "}
        {currentDoctor?.appointment_scheduling?.start_time} -{" "}
        {currentDoctor?.appointment_scheduling?.end_time}
      </p>

      {/* Doctor */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 p-3.5">
        <DoctorAvatar info={info} className="h-12 w-12 rounded-full" sizes="48px" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{info?.doctor_name}</p>
          {info?.qualifications && (
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
              {info.qualifications}
            </p>
          )}
          {info?.speciality && (
            <Badge tone="navy" className="mt-1.5 max-w-full">
              <span className="truncate">{info.speciality}</span>
            </Badge>
          )}
          {currentDoctor?.consultationCenterInfo?.center_name && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-gray-600">
              <LuBuilding2 className="mt-0.5 shrink-0 text-gray-400" />
              {currentDoctor.consultationCenterInfo.center_name}
            </p>
          )}
        </div>
      </div>

      {/* Patient */}
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-gray-50 px-3.5 py-3">
        <LuUserRound className="shrink-0 text-lg text-gray-400" />
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-gray-900">
            {selectedPatient?.patient_name}
          </p>
          <p className="text-xs tabular-nums text-gray-500">
            {selectedPatient?.contact}
          </p>
        </div>
      </div>

      {/* Date and time */}
      <div className="mt-5">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
          <LuCalendarDays className="text-[#0C3F8E] dark:text-[#7FB2FF]" />
          Date
        </p>
        {bookingDay ? (
          <p className="mt-2 inline-flex h-10 items-center rounded-full border border-[#0C3F8E] bg-[#0C3F8E]/[0.06] px-4 text-sm font-semibold text-[#0C3F8E] dark:border-[#7FB2FF] dark:text-[#7FB2FF]">
            {formatDate(appointment_date)} · {bookingDay?.day_name} (
            {weekday_bangla[weekday.indexOf(bookingDay?.day_name)]})
          </p>
        ) : (
          <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            No bookable day is open for this chamber right now.
          </p>
        )}

        {slots.length > 0 && (
          <>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <LuClock className="text-[#0C3F8E] dark:text-[#7FB2FF]" />
              Time slot <span className="font-normal text-gray-500">(পরামর্শের সময়)</span>
            </p>
            <div role="radiogroup" className="mt-2 grid gap-2 sm:grid-cols-2">
              {slots.map((slot) => {
                const checked = timeSlot === slot.value;
                return (
                  <label
                    key={slot.value}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                      checked
                        ? "border-[#0C3F8E] bg-[#0C3F8E]/[0.05] ring-1 ring-[#0C3F8E] dark:border-[#7FB2FF] dark:ring-[#7FB2FF]"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="radio-buttons-group"
                      value={slot.value}
                      checked={checked}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="sr-only"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-gray-500">
                        {slot.label}
                      </span>
                      <span className="block text-sm font-semibold tabular-nums text-gray-900">
                        {slot.value}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        checked
                          ? "border-[#0C3F8E] bg-[#0C3F8E] text-white dark:border-[#7FB2FF] dark:bg-[#7FB2FF]"
                          : "border-gray-300"
                      }`}
                    >
                      {checked && <LuCheck className="text-xs" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>

      <PrimaryButton
        onClick={(e) => handleBookAppointment(e)}
        disabled={progressing}
        className="mt-6"
      >
        <LuCalendarCheck className="text-base" />
        {progressing ? "Booking..." : "Book appointment"}
      </PrimaryButton>
    </div>
  );
};

export default AppointmentModalDetails;
