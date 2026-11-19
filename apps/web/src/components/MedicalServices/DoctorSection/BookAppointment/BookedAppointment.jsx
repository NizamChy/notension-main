"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { LuBuilding2, LuCalendarDays, LuClock, LuUserRound } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { toLocalYMD } from "@/utils/date";
import {
  Badge,
  CARD,
  EmptyState,
  PageHeader,
  PRIMARY_BUTTON,
  StatusBadge,
} from "@/components/shared/UI/UI";
import { MedicalContainer } from "../../Layout/MedicalLayout";
import { MetaItem } from "../../Layout/MedicalUI";

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
    <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0C3F8E]/10 text-[#0C3F8E] dark:text-[#7FB2FF]">
      <span className="text-xl font-bold leading-none tabular-nums">
        {Number.isNaN(day) ? "--" : day}
      </span>
      <span className="mt-1 text-[11px] font-semibold tracking-wide">
        {month || ""}
      </span>
    </div>
  );
};

const BookedAppointment = () => {
  const dispatch = useDispatch();
  const { bookedAppoinmentInfo } = useSelector((state) => state.user);

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

  return (
    <MedicalContainer className="py-6 md:py-10">
      <PageHeader
        title="My appointments"
        subtitle={
          bookedAppoinmentInfo?.length > 0
            ? `অ্যাপয়েন্টমেন্টের তালিকা · ${bookedAppoinmentInfo.length} upcoming`
            : "Upcoming doctor appointments you have booked."
        }
      />

      {bookedAppoinmentInfo?.length < 1 && (
        <EmptyState
          icon={<LuCalendarDays />}
          title="No upcoming appointments"
          text="Book a serial with a doctor and it will show up here."
          action={
            <Link href="/medical-services/doctor" className={PRIMARY_BUTTON}>
              Find a doctor
            </Link>
          }
        />
      )}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {[...bookedAppoinmentInfo]
          ?.slice()
          ?.reverse()
          ?.map((appointment) => (
            <li
              key={appointment?._id}
              className={`${CARD} flex h-full flex-col p-4 sm:p-5`}
            >
              <div className="flex items-start gap-3">
                <DateCard date={appointment?.appointment_date} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={appointment?.status || "Booked"} />
                    {appointment?.serial_no != null && (
                      <Badge tone="orange">Serial #{appointment.serial_no}</Badge>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-1 font-semibold text-gray-900">
                    {appointment?.doctor_name}
                  </p>
                  {appointment?.doctor_speciality && (
                    <p className="line-clamp-1 text-sm text-gray-500">
                      {appointment.doctor_speciality}
                    </p>
                  )}
                </div>
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-dashed border-gray-200 pt-4 text-sm text-gray-600">
                <MetaItem icon={LuCalendarDays}>
                  {appointment?.appointment_day}
                  {getBanglaDay(appointment?.appointment_day)
                    ? ` (${getBanglaDay(appointment?.appointment_day)})`
                    : ""}
                </MetaItem>
                {appointment?.time_slot && (
                  <MetaItem icon={LuClock}>
                    <span className="tabular-nums">{appointment.time_slot}</span>
                  </MetaItem>
                )}
                {appointment?.consultation_center_name && (
                  <MetaItem icon={LuBuilding2}>
                    <span className="line-clamp-1">
                      {appointment.consultation_center_name}
                    </span>
                  </MetaItem>
                )}
                {appointment?.patient_info?.patient_name && (
                  <MetaItem icon={LuUserRound}>
                    Patient:{" "}
                    <span className="font-medium text-gray-900">
                      {appointment.patient_info.patient_name}
                    </span>
                  </MetaItem>
                )}
              </ul>
            </li>
          ))}
      </ul>
    </MedicalContainer>
  );
};

export default BookedAppointment;
