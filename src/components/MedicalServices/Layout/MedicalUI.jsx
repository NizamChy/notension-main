"use client";

import React from "react";
import Image from "next/image";
import { LuHeart, LuLoaderCircle } from "react-icons/lu";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { CARD, Skeleton } from "@/components/shared/UI/UI";

// Small presentational helpers shared by the Medical Services pages.

// Image fields are file names under HEALTH_CARE_IMAGES; full URLs and
// root-relative paths are used as they are.
export const resolveHealthImage = (file) => {
  if (!file || typeof file !== "string") return null;
  if (/^(https?:)?\/\//.test(file) || file.startsWith("/")) return file;
  return `${HEALTH_CARE_IMAGES}/${file}`;
};

// Doctor photo (profile_pic) with the gendered illustration as a fallback.
export const doctorPhoto = (info) =>
  resolveHealthImage(info?.profile_pic) ||
  (info?.gender === "Female"
    ? "/images/medical-services/doctor-female.png"
    : "/images/medical-services/doctor-male.png");

export const formatDistance = (meters) => {
  const value = Number(meters);
  if (!Number.isFinite(value)) return null;
  return value < 1000
    ? `${Math.round(value)} m away`
    : `${(value / 1000).toFixed(1)} km away`;
};

// "Deltal Care Centre" etc. -> short, correctly spelled labels.
export const centerTypeLabel = (type = "") => {
  const t = String(type).toLowerCase();
  if (!t) return null;
  if (t.includes("hospital")) return "Hospital";
  if (t.includes("diagnostic")) return "Diagnostic centre";
  if (t.includes("eye")) return "Eye care";
  if (t.includes("deltal") || t.includes("dental")) return "Dental care";
  if (t.includes("consultation")) return "Consultation centre";
  return type;
};

// Square / circular doctor photo; real photos are cropped from the top so the
// face stays in frame.
export const DoctorAvatar = ({
  info,
  name,
  className = "h-16 w-16 rounded-full",
  sizes = "80px",
  priority = false,
}) => (
  <span
    className={`relative block shrink-0 overflow-hidden bg-[#EAF1FB] ring-1 ring-gray-200 dark:bg-[#0C3F8E]/20 ${className}`}
  >
    <Image
      src={doctorPhoto(info)}
      alt={name || info?.doctor_name || "Doctor"}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover object-top"
    />
  </span>
);

// Icon + text line used in card meta lists.
export const MetaItem = ({ icon: Icon, children, className = "" }) => (
  <li className={`flex min-w-0 items-start gap-2 ${className}`}>
    {Icon && <Icon className="mt-0.5 shrink-0 text-[15px] text-gray-400" />}
    <span className="min-w-0">{children}</span>
  </li>
);

// Round heart button. `active` fills it; `onClick` is optional.
export const FavouriteButton = ({
  active = false,
  onClick,
  label,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={label || (active ? "Saved to favourites" : "Add to favourites")}
    title={label || (active ? "Saved to favourites" : "Add to favourites")}
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
      active
        ? "border-[#D92D20]/20 bg-[#D92D20]/10 text-[#D92D20]"
        : "border-gray-200 bg-white text-gray-500 hover:border-[#D92D20]/30 hover:text-[#D92D20]"
    } ${className}`}
  >
    <LuHeart className={`text-lg ${active ? "fill-current" : ""}`} />
  </button>
);

// Inline spinner for "loading more" rows (the page Loader is full height).
export const InlineSpinner = ({ label = "Loading more" }) => (
  <div
    role="status"
    className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500"
  >
    <LuLoaderCircle className="animate-spin text-lg text-[#0C3F8E] dark:text-[#7FB2FF]" />
    {label}
  </div>
);

export const DoctorCardSkeleton = () => (
  <div className={`${CARD} p-4 sm:p-5`}>
    <div className="flex items-start gap-4">
      <Skeleton className="h-16 w-16 shrink-0 !rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-5 w-24 !rounded-full" />
      </div>
    </div>
    <Skeleton className="mt-5 h-3 w-2/3" />
    <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-10 w-32 !rounded-full" />
    </div>
  </div>
);

export const CenterCardSkeleton = () => (
  <div className={`${CARD} overflow-hidden`}>
    <Skeleton className="aspect-[16/9] w-full !rounded-none" />
    <div className="space-y-2 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6, item: Item, className = "" }) => (
  <div
    aria-hidden="true"
    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 ${className}`}
  >
    {Array.from({ length: count }).map((_, index) => (
      <Item key={index} />
    ))}
  </div>
);
