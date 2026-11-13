"use client";

import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import SectionHeader from "./SectionHeader";
import useGatedNavigate from "./useGatedNavigate";
import { homeImage } from "./constants";

const CATEGORIES = [
  {
    title: "Grocery",
    description: "Fresh produce, staples and household needs.",
    cta: "Shop groceries",
    path: "/grocery/home",
    image: homeImage("grocery"),
    accent: "text-[#2E8B57]",
  },
  {
    title: "Medicine",
    description: "Prescription and OTC medicine from licensed pharmacies.",
    cta: "Order medicine",
    path: "/medicine/home",
    image: homeImage("medicine"),
    accent: "text-[#0D7C66]",
  },
  {
    title: "Food",
    description: "Meals from local restaurants, delivered hot.",
    cta: "Order food",
    path: "/food",
    image: homeImage("food"),
    accent: "text-[#D9481C]",
  },
  {
    title: "Fashion & Lifestyle",
    description: "Clothing, home decor and everyday lifestyle picks.",
    cta: "Shop fashion",
    path: "/fashion-lifestyle",
    image: homeImage("fashion"),
    accent: "text-[#5B4B8A]",
  },
];

const ShopCategories = () => {
  const { navigate, locationModal } = useGatedNavigate();

  return (
    <section id="services" className="scroll-mt-28">
      <SectionHeader
        eyebrow="Shop"
        title="Everything for your home, delivered"
        description="Pick a store and get it at your door, from verified sellers in your area."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 md:gap-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.title}
            type="button"
            onClick={() => navigate(c.path)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 300px, 50vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-[1.06] dark:brightness-90`}
              />
            </div>
            <div className="flex flex-1 flex-col p-3.5 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold leading-snug text-gray-900">
                {c.title}
              </h3>
              <p className="mt-1 flex-1 text-xs sm:text-sm leading-relaxed text-gray-500">
                {c.description}
              </p>
              <span
                className={`mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${c.accent} dark:text-[#FF8A5B]`}
              >
                {c.cta}
                <HiArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {locationModal}
    </section>
  );
};

export default ShopCategories;
