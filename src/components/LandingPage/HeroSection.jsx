"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi";
import { LuShieldCheck, LuTruck, LuWallet } from "react-icons/lu";
import { APP_URL, illustration } from "./constants";

const HERO_TILES = [
  { name: "grocery", label: "Grocery" },
  { name: "medicine", label: "Medicine" },
  { name: "food", label: "Food" },
  { name: "doctor", label: "Doctors" },
];

const TRUST_POINTS = [
  { Icon: LuShieldCheck, label: "Verified stores & doctors" },
  { Icon: LuTruck, label: "Doorstep delivery" },
  { Icon: LuWallet, label: "Cash on delivery, bKash & Nagad" },
];

const HeroSection = () => {
  const districtName = useSelector(
    (state) => state.user.currentUserLocation?.districtName
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071B3D] via-[#0C3F8E] to-[#0E4FA8] text-white">
      {/* Soft glows give the flat gradient some depth */}
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#EB5C2F]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#41B3A2]/20 blur-3xl" />

      <div className="relative grid items-center gap-10 px-6 py-10 sm:px-10 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:px-14 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs md:text-sm font-medium backdrop-blur">
            <FaLocationDot className="text-[#FF8A5B]" />
            {districtName
              ? `Now serving ${districtName}`
              : "Serving cities across Bangladesh"}
          </span>

          <h1 className="mt-5 text-[32px] leading-[1.15] sm:text-5xl lg:text-[56px] lg:leading-[1.08] font-bold tracking-tight">
            Everyday essentials &amp; healthcare,{" "}
            <span className="text-[#FF8A5B]">without the tension.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-white/75">
            Order groceries, medicine and food, shop fashion, book doctors and
            find hospitals, nurses or an ambulance near you, all from one
            place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#services"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#EB5C2F] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#EB5C2F]/30 transition hover:bg-[#d94e23]"
            >
              Explore services
              <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href={APP_URL}
              target="_blank"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Get the app
            </Link>
          </div>

          <ul className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {TRUST_POINTS.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <Icon className="text-lg text-[#7FD8C9]" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Image collage, desktop and tablet only */}
        <div className="relative hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            {HERO_TILES.map(({ name, label }, i) => (
              <div
                key={name}
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-black/20 ring-1 ring-white/10 ${
                  i % 2 ? "translate-y-6" : ""
                }`}
              >
                <Image
                  src={illustration(name)}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 280px, 45vw"
                  className="object-cover"
                />
                {/* Explicit colors: the illustrations are light in both
                    themes, so this label must not follow dark mode. */}
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#FFFFFFEB] px-2.5 py-1 text-xs font-semibold text-[#1E2A3B] shadow-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
