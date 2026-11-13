"use client";

import React from "react";
import Link from "next/link";
import { LuPhoneCall } from "react-icons/lu";
import SectionHeader from "./SectionHeader";
import ServiceTile from "./ServiceTile";
import useGatedNavigate from "./useGatedNavigate";
import { APP_URL, HOTLINE, HOTLINE_TEL, illustration } from "./constants";

// Nurse, ambulance and blood donor requests are handled in the mobile app.
const APP_SERVICES = [
  {
    title: "Nurse at home",
    description: "Trained nurses for home care and recovery.",
    image: illustration("nurse"),
  },
  {
    title: "Ambulance",
    description: "Request an ambulance quickly, any time of day.",
    image: illustration("ambulance"),
  },
  {
    title: "Blood donors",
    description: "Reach donors by blood group in your area.",
    image: illustration("blood"),
  },
];

const CareSection = () => {
  const { navigate, locationModal } = useGatedNavigate();

  return (
    <section id="care" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Care & emergency"
        title="Help when it matters most"
        description="Home care, emergency transport and blood donors, plus everyday services for your home."
      />

      <div className="grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {APP_SERVICES.map((s) => (
          <ServiceTile
            key={s.title}
            as={Link}
            href={APP_URL}
            target="_blank"
            prefetch={false}
            image={s.image}
            title={s.title}
            description={s.description}
            cta="Request in app"
          />
        ))}
        <ServiceTile
          image={illustration("home-services")}
          title="All care services"
          description="Cleaning, repairs, AC service, shifting and more."
          cta="Browse services"
          onClick={() => navigate("/all-care-services")}
        />
      </div>

      {/* Emergency hotline */}
      <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl border border-[#F40035]/15 bg-[#FFF1F2] p-5 sm:flex-row sm:items-center md:p-6 dark:border-[#F40035]/25 dark:bg-[#2a181c]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F40035] text-xl text-white">
          <LuPhoneCall />
        </span>
        <div className="flex-1">
          <p className="text-base md:text-lg font-semibold text-gray-900">
            Need urgent help?
          </p>
          <p className="text-sm text-gray-600">
            Call our support line and we&apos;ll connect you with the right
            service.
          </p>
        </div>
        <a
          href={`tel:${HOTLINE_TEL}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F40035] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d4002e] sm:w-auto"
        >
          <LuPhoneCall /> {HOTLINE}
        </a>
      </div>

      {locationModal}
    </section>
  );
};

export default CareSection;
