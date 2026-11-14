"use client";

import React from "react";
import {
  LuBadgeCheck,
  LuBuilding2,
  LuCalendarCheck,
  LuClock,
  LuDoorOpen,
  LuMapPin,
  LuPhone,
} from "react-icons/lu";
import { Badge, CARD, PRIMARY_BUTTON } from "@/components/shared/UI/UI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import { MedicalContainer, MedicalSectionTitle } from "../../Layout/MedicalLayout";
import { DoctorAvatar, FavouriteButton } from "../../Layout/MedicalUI";

const DAY_SHORT = {
  Saturday: "Sat",
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
};

const hasFee = (value) => value != null && value !== "" && Number(value) > 0;

const ChamberCard = ({ profile, canBook, onBook }) => {
  const center = profile?.consultationCenterInfo;
  const timeSlots = [1, 2, 3]
    .map((index) => profile?.[`chamber_onDay_time_slot_${index}`])
    .filter(Boolean);
  const contacts = [1, 2, 3]
    .map((index) => center?.[`apointment_contact_${index}`])
    .filter(Boolean);
  const schedule = Array.isArray(profile?.chamber_schedule)
    ? profile.chamber_schedule
    : [];
  const fee = profile?.consultation_fee ?? profile?.doctorInfo?.consultation_fee;
  const followUp = profile?.follow_up_fee ?? profile?.doctorInfo?.follow_up_fee;

  return (
    <article className={`${CARD} p-5 md:p-6`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C3F8E]/10 text-lg text-[#0C3F8E] dark:text-[#7FB2FF]">
          <LuBuilding2 />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 md:text-lg">
              {center?.center_name}
            </h3>
            {profile?.is_chamber_off && <Badge tone="red">Chamber off</Badge>}
          </div>
          {center?.address && (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-600">
              <LuMapPin className="mt-0.5 shrink-0 text-gray-400" />
              <span>{center.address}</span>
            </p>
          )}
          {profile?.room_no && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              <LuDoorOpen className="shrink-0 text-gray-400" />
              Room {profile.room_no}
            </p>
          )}
        </div>
      </div>

      {schedule.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Chamber days
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {schedule.map((day) => (
              <li
                key={day?.day_name}
                title={day?.is_closed ? `${day?.day_name}: closed` : day?.day_name}
                className={`inline-flex h-9 min-w-[3rem] items-center justify-center rounded-full border px-3 text-xs font-semibold ${
                  day?.is_closed
                    ? "border-gray-200 bg-gray-50 text-gray-400 line-through"
                    : "border-[#12B76A]/30 bg-[#12B76A]/10 text-[#067647] dark:text-[#47CD89]"
                }`}
              >
                {DAY_SHORT[day?.day_name] || day?.day_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {timeSlots.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Consultation hours <span className="normal-case">(পরামর্শের সময়)</span>
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {timeSlots.map((timeSlot) => (
              <li
                key={timeSlot}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
              >
                <LuClock className="shrink-0 text-[#0C3F8E] dark:text-[#7FB2FF]" />
                {timeSlot}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(hasFee(fee) || hasFee(followUp)) && (
        <dl className="mt-5 grid grid-cols-2 gap-3">
          {hasFee(fee) && (
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-xs text-gray-500">Consultation fee</dt>
              <dd className="mt-0.5 font-bold tabular-nums text-gray-900">
                {formatTaka(fee)}
              </dd>
            </div>
          )}
          {hasFee(followUp) && (
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-xs text-gray-500">Follow-up fee</dt>
              <dd className="mt-0.5 font-bold tabular-nums text-gray-900">
                {formatTaka(followUp)}
              </dd>
            </div>
          )}
        </dl>
      )}

      {contacts.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            For serial <span className="normal-case">(সিরিয়ালের জন্য)</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {contacts.map((contact) => (
              <a
                key={contact}
                href={`tel:${String(contact).replace(/[^\d+]/g, "")}`}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium tabular-nums text-gray-800 transition-colors hover:border-[#0C3F8E]/40 hover:text-[#0C3F8E] dark:hover:text-[#7FB2FF]"
              >
                <LuPhone className="text-[#12B76A]" />
                {contact}
              </a>
            ))}
          </div>
        </div>
      )}

      {canBook && (
        <button
          type="button"
          onClick={(e) => onBook(e, profile)}
          className={`${PRIMARY_BUTTON} mt-6 w-full sm:w-auto`}
        >
          <LuCalendarCheck className="text-base" />
          Book appointment
        </button>
      )}
    </article>
  );
};

// Shared doctor profile layout: header card with stats, profile details and
// one chamber card per consultation center. On lg+ a sticky booking card sits
// on the right; on mobile a bottom bar carries the Book button.
const DoctorProfileView = ({
  doctorInfo,
  chambers = [],
  canBook = () => false,
  onBook,
  favorite = null,
}) => {
  const bookable = chambers.filter((profile) => canBook(profile));
  const single = bookable.length === 1 ? bookable[0] : null;
  const firstChamber = chambers[0];
  const fee =
    firstChamber?.consultation_fee ?? doctorInfo?.consultation_fee ?? null;
  const experience = doctorInfo?.experience_years;

  const stats = [
    experience ? { label: "Experience", value: `${experience}+ yrs` } : null,
    hasFee(fee) ? { label: "Consultation", value: formatTaka(fee) } : null,
    chambers.length > 0
      ? {
          label: chambers.length === 1 ? "Chamber" : "Chambers",
          value: chambers.length,
        }
      : null,
  ].filter(Boolean);

  const details = [
    ["Speciality", doctorInfo?.speciality],
    ["Qualifications", doctorInfo?.qualifications],
    ["Designation", doctorInfo?.designation],
    ["Department", doctorInfo?.dept_name],
    ["BMDC reg. no.", doctorInfo?.bmdc_reg_no],
  ].filter(([, value]) => value);

  const bookCta = single ? (
    <button
      type="button"
      onClick={(e) => onBook(e, single)}
      className={`${PRIMARY_BUTTON} w-full`}
    >
      <LuCalendarCheck className="text-base" />
      Book appointment
    </button>
  ) : bookable.length > 1 ? (
    <a href="#chambers" className={`${PRIMARY_BUTTON} w-full`}>
      <LuCalendarCheck className="text-base" />
      Choose a chamber
    </a>
  ) : null;

  return (
    <MedicalContainer
      className={`min-h-content py-6 md:py-10 ${bookCta ? "pb-28 lg:pb-10" : ""}`}
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          {/* Header */}
          <section className={`${CARD} relative p-5 md:p-7`}>
            {favorite && (
              <div className="absolute right-4 top-4 md:right-6 md:top-6">
                <FavouriteButton
                  active={!!favorite.isAdded}
                  onClick={favorite.isAdded ? undefined : favorite.onAdd}
                />
              </div>
            )}

            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
              <DoctorAvatar
                info={doctorInfo}
                className="h-28 w-28 rounded-2xl md:h-32 md:w-32"
                sizes="128px"
                priority
              />

              <div className={`min-w-0 flex-1 ${favorite ? "sm:pr-12" : ""}`}>
                {doctorInfo?.speciality && (
                  <Badge tone="navy">{doctorInfo.speciality}</Badge>
                )}
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  {doctorInfo?.doctor_name}
                </h1>
                {doctorInfo?.qualifications && (
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 md:text-base">
                    {doctorInfo.qualifications}
                  </p>
                )}
                {doctorInfo?.designation && (
                  <p className="mt-1 text-sm text-gray-500">
                    {doctorInfo.designation}
                  </p>
                )}
                {doctorInfo?.bmdc_reg_no && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#067647] dark:text-[#47CD89]">
                    <LuBadgeCheck className="text-sm" />
                    BMDC reg. {doctorInfo.bmdc_reg_no}
                  </p>
                )}
              </div>
            </div>

            {stats.length > 0 && (
              <dl
                className={`mt-6 grid gap-3 border-t border-gray-100 pt-5 ${
                  stats.length === 3 ? "grid-cols-3" : "grid-cols-2"
                }`}
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse rounded-xl bg-gray-50 px-3 py-3 text-center"
                  >
                    <dt className="mt-0.5 text-xs text-gray-500">
                      {stat.label}
                    </dt>
                    <dd className="text-base font-bold tabular-nums text-gray-900 md:text-lg">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* About */}
          {(doctorInfo?.about || details.length > 0) && (
            <section className={`${CARD} p-5 md:p-7`}>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                About
              </h2>
              {doctorInfo?.about && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
                  {doctorInfo.about}
                </p>
              )}
              {details.length > 0 && (
                <dl className="mt-4 divide-y divide-gray-100">
                  {details.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 py-2.5 text-sm sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4"
                    >
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}

          {/* Chambers */}
          {chambers.length > 0 && (
            <section id="chambers" className="scroll-mt-28">
              <MedicalSectionTitle subtitle="পরামর্শ কেন্দ্র ও সময়সূচি">
                Chambers and schedule
              </MedicalSectionTitle>
              <div className="space-y-4">
                {chambers.map((profile) => (
                  <ChamberCard
                    key={profile?._id}
                    profile={profile}
                    canBook={canBook(profile)}
                    onBook={onBook}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Booking card (lg+) */}
        <aside className="hidden lg:sticky lg:top-[104px] lg:block">
          <div className={`${CARD} p-6`}>
            <p className="text-sm text-gray-500">Consultation fee</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
              {hasFee(fee) ? formatTaka(fee) : "Ask at chamber"}
            </p>
            {firstChamber?.consultationCenterInfo?.center_name && (
              <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                <LuBuilding2 className="mt-0.5 shrink-0 text-gray-400" />
                {chambers.length > 1
                  ? `${chambers.length} chambers available`
                  : firstChamber.consultationCenterInfo.center_name}
              </p>
            )}
            <div className="mt-5">
              {bookCta || (
                <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  Online booking is not available right now. Call the chamber
                  for a serial.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky book bar (mobile / tablet) */}
      {bookCta && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            {hasFee(fee) && (
              <div className="shrink-0">
                <p className="text-[11px] text-gray-500">Fee</p>
                <p className="font-bold tabular-nums text-gray-900">
                  {formatTaka(fee)}
                </p>
              </div>
            )}
            <div className="min-w-0 flex-1">{bookCta}</div>
          </div>
        </div>
      )}
    </MedicalContainer>
  );
};

export default DoctorProfileView;
