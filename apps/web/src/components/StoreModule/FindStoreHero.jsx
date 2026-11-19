import React from "react";
import Link from "next/link";
import {
  HiOutlineArrowRight,
  HiOutlineBuildingStorefront,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const COPY = {
  grocery: {
    eyebrow: "Grocery",
    title: "Fresh groceries from stores near you",
    text: "Browse local grocery stores, fill your cart and get it delivered to your door.",
    cta: "Find nearby stores",
  },
  medicine: {
    eyebrow: "Pharmacy",
    title: "Medicines from pharmacies nearby",
    text: "Order medicines and healthcare essentials from pharmacies around you, delivered to your door.",
    cta: "Find nearby pharmacies",
  },
};

const PERKS = [
  { icon: HiOutlineMapPin, label: "Stores near you" },
  { icon: HiOutlineClock, label: "Fast delivery" },
  { icon: HiOutlineShieldCheck, label: "Secure checkout" },
];

// Landing hero for /grocery/home and /medicine/home. Server-safe (no hooks).
const FindStoreHero = ({ moduleName }) => {
  const copy = COPY[moduleName];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0C3F8E] px-5 py-8 text-white shadow-lg shadow-[#0C3F8E]/20 sm:px-8 md:px-12 md:py-12">
      {/* Decorative rings */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[36px] border-[#FFFFFF]/[0.06]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-[#EB5C2F]/20 blur-2xl"
      />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFFFF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]/90">
            <HiOutlineBuildingStorefront className="text-sm" />
            {copy.eyebrow}
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#FFFFFF]/75 md:text-base">
            {copy.text}
          </p>

          <Link
            href={`/${moduleName}/home/find-store`}
            className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#EB5C2F] px-6 text-sm font-semibold text-white shadow-sm shadow-black/10 transition-colors hover:bg-[#D24E25]"
          >
            {copy.cta}
            <HiOutlineArrowRight className="text-base transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:gap-3 md:w-72 md:grid-cols-1">
          {PERKS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-[#FFFFFF]/[0.07] px-2 py-3 text-center text-xs font-medium text-[#FFFFFF]/90 ring-1 ring-[#FFFFFF]/10 md:flex-row md:px-4 md:text-left md:text-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF]/10">
                <Icon className="text-lg" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FindStoreHero;
