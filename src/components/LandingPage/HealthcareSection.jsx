"use client";

import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { LuCalendarCheck, LuStethoscope, LuClock } from "react-icons/lu";
import SectionHeader from "./SectionHeader";
import ServiceTile from "./ServiceTile";
import useGatedNavigate from "./useGatedNavigate";
import { illustration } from "./constants";

const SERVICES = [
  {
    title: "Hospitals",
    description: "Compare hospitals and departments near you.",
    path: "/medical-services/hospital",
    image: illustration("hospital"),
  },
  {
    title: "Diagnostic centers",
    description: "Lab tests and imaging from certified centers.",
    path: "/medical-services/diagnostic",
    image: illustration("diagnostic"),
  },
  {
    title: "Eye care",
    description: "Eye specialists, check-ups and optical care.",
    path: "/medical-services/eye-care-center",
    image: illustration("eye-care"),
  },
  {
    title: "Dental care",
    description: "Dentists for check-ups, cleaning and treatment.",
    path: "/medical-services/dental-care-center",
    image: illustration("dental"),
  },
];

const SPECIALTIES = [
  "Medicine",
  "Cardiology",
  "Pediatrics",
  "Gynecology",
  "Dermatology",
  "Orthopedics",
  "ENT",
  "Neurology",
];

const DOCTOR_POINTS = [
  { Icon: LuStethoscope, label: "Specialists across every field" },
  { Icon: LuClock, label: "See open slots and chamber times" },
];

const HealthcareSection = () => {
  const { navigate, locationModal } = useGatedNavigate();

  return (
    <section id="healthcare" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Healthcare"
        title="Find the right care, close to home"
        description="Book doctors and find hospitals, diagnostic centers and specialists in your district."
        action={
          <button
            type="button"
            onClick={() => navigate("/medical-services")}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0C3F8E] hover:underline dark:text-[#7FB2FF]"
          >
            All medical services
            <HiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        }
      />

      <div className="grid gap-4 md:gap-5 lg:grid-cols-[1fr_1.35fr]">
        {/* Featured: doctor appointments */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="relative aspect-[2/1] w-full">
            <Image
              src={illustration("doctor")}
              alt=""
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover dark:brightness-90"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#41B3A2]/15 px-3 py-1 text-xs font-semibold text-[#0D7C66] dark:text-[#7FD8C9]">
              <LuCalendarCheck /> Appointments
            </span>
            <h3 className="mt-3 text-xl md:text-2xl font-bold text-gray-900">
              Book a doctor in minutes
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {DOCTOR_POINTS.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Icon className="text-[#0D7C66] dark:text-[#7FD8C9]" />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Popular specialties
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SPECIALTIES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => navigate("/medical-services/doctor")}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 transition hover:border-[#0C3F8E]/40 hover:text-[#0C3F8E] dark:hover:text-[#7FB2FF]"
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="mt-6 flex-1 content-end">
              <button
                type="button"
                onClick={() => navigate("/medical-services/doctor")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C3F8E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A3478] sm:w-auto"
              >
                Find doctors <HiArrowRight />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {SERVICES.map((s) => (
            <ServiceTile
              key={s.title}
              layout="stack"
              image={s.image}
              title={s.title}
              description={s.description}
              onClick={() => navigate(s.path)}
            />
          ))}
        </div>
      </div>

      {locationModal}
    </section>
  );
};

export default HealthcareSection;
