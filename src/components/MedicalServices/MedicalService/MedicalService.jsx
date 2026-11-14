"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  LuArrowRight,
  LuBuilding2,
  LuCalendarCheck,
  LuEye,
  LuHeart,
  LuHospital,
  LuMicroscope,
  LuShieldCheck,
  LuStethoscope,
} from "react-icons/lu";
import { FaTooth } from "react-icons/fa6";
import { useServiceProvider } from "@/hooks/fetch-data/useServiceProvider";
import { CARD, CARD_HOVER } from "@/components/shared/UI/UI";
import DoctorCommonSlider from "../DoctorSection/DoctorCommonSlider/DoctorCommonSlider";
import SearchCenter from "../SearchMedicalCenter/SearchCenter";
import { MedicalContainer, MedicalSectionTitle } from "../Layout/MedicalLayout";

const SERVICES = [
  {
    href: "/medical-services/doctor",
    title: "Find a doctor",
    text: "Specialists by department, with online serial booking.",
    icon: LuStethoscope,
    tint: "bg-[#0C3F8E]/10 text-[#0C3F8E] dark:text-[#7FB2FF]",
  },
  {
    href: "/medical-services/doctor/consultation-center",
    title: "Consultation centres",
    text: "Chambers near you and the doctors who sit there.",
    icon: LuBuilding2,
    tint: "bg-[#12B76A]/10 text-[#067647] dark:text-[#47CD89]",
  },
  {
    href: "/medical-services/hospital",
    title: "Hospitals",
    text: "General and specialised hospitals in your district.",
    icon: LuHospital,
    tint: "bg-[#D92D20]/10 text-[#B42318] dark:text-[#F97066]",
  },
  {
    href: "/medical-services/diagnostic",
    title: "Diagnostic centres",
    text: "Lab tests, imaging and health check-ups.",
    icon: LuMicroscope,
    tint: "bg-[#F79009]/10 text-[#B54708] dark:text-[#FDB022]",
  },
  {
    href: "/medical-services/eye-care-center",
    title: "Eye care",
    text: "Eye specialists, vision tests and treatment.",
    icon: LuEye,
    tint: "bg-[#0C3F8E]/10 text-[#0C3F8E] dark:text-[#7FB2FF]",
  },
  {
    href: "/medical-services/dental-care-center",
    title: "Dental care",
    text: "Dentists for check-ups, cleaning and treatment.",
    icon: FaTooth,
    tint: "bg-[#EB5C2F]/10 text-[#C4320A] dark:text-[#FF8A5B]",
  },
];

const SHORTCUTS = [
  {
    href: "/medical-services/doctor/booked-appointment",
    title: "My appointments",
    icon: LuCalendarCheck,
  },
  {
    href: "/medical-services/favorite-doctor",
    title: "Favourite doctors",
    icon: LuHeart,
  },
  {
    href: "/medical-services/favorite-consultation",
    title: "Favourite centres",
    icon: LuBuilding2,
  },
];

const MedicalService = () => {
  const [slider, setSlider] = useState([]);
  const [providerBanner, setProviderBanner] = useState([]);

  const { exploreMedicalServiceProvider } = useServiceProvider();

  useEffect(() => {
    exploreMedicalServiceProvider(setProviderBanner);
  }, []);

  useEffect(() => {
    if (providerBanner && providerBanner?.length > 1) {
      setSlider(providerBanner?.slice(0, providerBanner?.length - 4));
    }
  }, [providerBanner]);

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-gray-50">
        <MedicalContainer className="grid items-center gap-6 py-8 md:py-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EB5C2F]">
              Medical services
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Trusted care, close to home
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">
              Find doctors, hospitals and diagnostic centres near you, and book
              your serial online in a few taps.
            </p>
            <SearchCenter className="mt-6 !mx-0" />
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <LuShieldCheck className="text-base text-[#12B76A]" />
              Verified doctors and registered centres
            </p>
          </div>
          <DoctorCommonSlider slider={slider} />
        </MedicalContainer>
      </div>

      <MedicalContainer className="space-y-10 py-8 md:space-y-14 md:py-12">
        {/* Services */}
        <section>
          <MedicalSectionTitle subtitle="What do you need today?">
            Browse services
          </MedicalSectionTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {SERVICES.map(({ href, title, text, icon: Icon, tint }) => (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-4 p-4 md:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] ${CARD} ${CARD_HOVER}`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${tint}`}
                >
                  <Icon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-gray-900">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-gray-500">
                    {text}
                  </span>
                </span>
                <LuArrowRight className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0C3F8E] dark:group-hover:text-[#7FB2FF]" />
              </Link>
            ))}
          </div>
        </section>

        {/* Shortcuts */}
        <section>
          <MedicalSectionTitle>Your health</MedicalSectionTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
            {SHORTCUTS.map(({ href, title, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`group flex min-h-14 items-center gap-3 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] ${CARD} ${CARD_HOVER}`}
              >
                <Icon className="shrink-0 text-lg text-[#0C3F8E] dark:text-[#7FB2FF]" />
                <span className="flex-1 text-sm font-semibold text-gray-900">
                  {title}
                </span>
                <LuArrowRight className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </MedicalContainer>
    </div>
  );
};

export default MedicalService;
