import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";

/**
 * Service card. "row": square thumbnail left, copy right (compact lists).
 * "stack": wide image on top, copy below (grids next to a featured card).
 * Renders a button by default, or whatever element `as` names (e.g. Link).
 */
const ServiceTile = ({
  as: Tag = "button",
  layout = "row",
  image,
  title,
  description,
  cta = "Find nearby",
  tint = "bg-gray-50",
  ...props
}) => {
  const stack = layout === "stack";

  return (
    <Tag
      {...(Tag === "button" ? { type: "button" } : {})}
      {...props}
      className={`group flex w-full rounded-2xl border border-gray-200 bg-white text-left transition duration-300 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] ${
        stack
          ? "flex-col overflow-hidden"
          : "items-center gap-4 p-3 pr-4"
      }`}
    >
      <span
        className={`relative shrink-0 overflow-hidden ${tint} ${
          stack
            ? "aspect-[16/10] w-full"
            : "h-20 w-20 md:h-24 md:w-24 rounded-xl"
        }`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes={stack ? "(min-width: 1024px) 360px, 50vw" : "96px"}
          className={`object-cover transition-transform duration-500 group-hover:scale-110 dark:brightness-90`}
        />
      </span>
      <span
        className={`flex min-w-0 flex-1 flex-col ${stack ? "p-3.5 sm:p-5" : ""}`}
      >
        <span className="text-[15px] sm:text-base font-semibold leading-snug text-gray-900">
          {title}
        </span>
        <span className="mt-0.5 text-xs sm:text-sm leading-snug text-gray-500 line-clamp-2">
          {description}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
          {cta}
          <HiArrowRight className="transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </Tag>
  );
};

export default ServiceTile;
