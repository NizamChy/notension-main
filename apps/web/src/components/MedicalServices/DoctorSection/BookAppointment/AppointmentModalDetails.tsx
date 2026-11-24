"use client";

import notify from "@/utils/notify";
import {
  LuBuilding2,
  LuCalendarCheck,
  LuCalendarDays,
  LuCheck,
  LuClock,
  LuUserRound,
} from "react-icons/lu";
import React, { useState, type MouseEvent } from "react";
import { useBookAppointment } from "@/hooks/healthCare/usePatients";
import { useBookingChamber } from "@/hooks/healthCare/useDoctors";
import { toLocalYMD } from "@/utils/date";
import { Badge } from "@/components/shared/UI/UI";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import type { HealthRecord } from "@/stores/healthStore";
import { DoctorAvatar } from "../../Layout/MedicalUI";

/** A saved patient with the fields the booking pages show. */
export type PatientRecord = HealthRecord & {
  patient_name?: string;
  contact?: string;
  date_of_birth?: string;
};

type SlotKey = "morning" | "afternoon" | "evening";

const SLOT_KEYS: [SlotKey, string][] = [
  ["morning", "Morning"],
  ["afternoon", "Afternoon"],
  ["evening", "Evening"],
];

type Props = {
  selectedPatient: PatientRecord;
  onClose: () => void;
};

const AppointmentModalDetails = ({ selectedPatient, onClose }: Props) => {
  const [timeSlot, setTimeSlot] = useState("");

  const today = new Date();

  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const currentDate = today.toLocaleDateString("en-GB", options);

  const { progressing, book: bookAppointment } = useBookAppointment();
  const { chamber: currentDoctor } = useBookingChamber();

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

  const formatAMPM = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const strMinutes = minutes.toString().padStart(2, "0");
    const strHours = hours.toString().padStart(2, "0");
    return `${strHours}:${strMinutes} ${ampm}`;
  };

  const current_day_name = weekday[(today.getDay() + 1) % 7];
  const CurrentDay = new Date(today.setDate(today.getDate()));
  const formattedDate = toLocalYMD(CurrentDay);
  const formattedTime = formatAMPM(CurrentDay);

  const isTimeInSlot = (current_time: string, slot_start: string, slot_end: string) => {
    const convertTo24Hour = (str: string) => {
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

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // The next open chamber day (from today) and its date, or undefined when
  // none of the open days is a known weekday.
  const getNextAppointmentDay = (currentDay: string, openDays: string[]) => {
    const currentIndex = weekday.indexOf(currentDay);
    for (let i = 0; i <= 6; i++) {
      const nextIndex = (currentIndex + i) % 7;
      if (openDays.includes(weekday[nextIndex])) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return { day: weekday[nextIndex], date: toLocalYMD(date) };
      }
    }
    return undefined;
  };

  // The bookable day (and its date), derived from the doctor's schedule
  // during render. "" when nothing is bookable; undefined when the doctor
  // books next-day but no open day matched.
  const getBooking = (): { day: string | undefined; date: string } => {
    const schedule = currentDoctor?.chamber_schedule ?? [];
    const schedulingType = currentDoctor?.appointment_scheduling?.scheduling_type;
    const openDays = schedule
      .filter((day) => !day?.is_closed)
      .map((day) => day?.day_name);

    if (schedulingType === "ScheduleForNextDay" && openDays.length > 0) {
      const next = getNextAppointmentDay(current_day_name, openDays);
      return next ?? { day: undefined, date: formattedDate };
    }
    if (
      schedulingType === "ScheduleForSameDay" &&
      openDays.includes(current_day_name)
    ) {
      return { day: current_day_name, date: formattedDate };
    }
    return { day: "", date: formattedDate };
  };
  const { day: Available_Booking_Day, date: appointment_date } = getBooking();

  const handleBookAppointment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!timeSlot) {
      notify.warning("Please select a time slot.");
      return;
    }

    if (
      !isTimeInSlot(
        formattedTime,
        // The modal opens from the booking page, which has the chamber.
        currentDoctor?.appointment_scheduling?.start_time as string,
        currentDoctor?.appointment_scheduling?.end_time as string
      )
    ) {
      notify.warning(`Please choose a time between ${currentDoctor?.appointment_scheduling?.start_time} and ${currentDoctor?.appointment_scheduling?.end_time}.`);
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
          <LuCalendarDays className="text-primary dark:text-[#7FB2FF]" />
          Date
        </p>
        {bookingDay ? (
          <p className="mt-2 inline-flex h-10 items-center rounded-full border border-primary bg-primary/6 px-4 text-sm font-semibold text-primary dark:border-[#7FB2FF] dark:text-[#7FB2FF]">
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
              <LuClock className="text-primary dark:text-[#7FB2FF]" />
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
                        ? "border-primary bg-primary/5 ring-1 ring-[#0C3F8E] dark:border-[#7FB2FF] dark:ring-[#7FB2FF]"
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
                          ? "border-primary bg-primary text-white dark:border-[#7FB2FF] dark:bg-[#7FB2FF]"
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
        onClick={(e: MouseEvent<HTMLButtonElement>) => handleBookAppointment(e)}
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
