import React from "react";
import { LuMapPin, LuStore, LuPackageCheck } from "react-icons/lu";
import SectionHeader from "./SectionHeader";

const STEPS = [
  {
    Icon: LuMapPin,
    title: "Set your location",
    text: "Choose your district so we show stores and services that reach you.",
  },
  {
    Icon: LuStore,
    title: "Pick a store or service",
    text: "Browse groceries, medicine, food, fashion or healthcare providers.",
  },
  {
    Icon: LuPackageCheck,
    title: "Order or book",
    text: "Pay with cash, bKash or Nagad, and track it until it reaches you.",
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="scroll-mt-28 rounded-3xl bg-gray-50 px-6 py-10 md:px-10 md:py-14">
    <SectionHeader eyebrow="How it works" title="Three steps, no tension" />

    <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
      {STEPS.map(({ Icon, title, text }, i) => (
        <li key={title} className="relative">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-[#0C3F8E] shadow-sm ring-1 ring-gray-200 dark:text-[#7FB2FF]">
              <Icon />
            </span>
            <span className="text-sm font-semibold text-gray-400">
              Step {i + 1}
            </span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{text}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default HowItWorks;
