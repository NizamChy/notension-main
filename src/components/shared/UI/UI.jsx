"use client";

import React from "react";
import Link from "next/link";
import { HiArrowRight, HiChevronLeft } from "react-icons/hi";
import { HiOutlineInbox } from "react-icons/hi2";

// Small design-system pieces shared by every module page. Colours:
// navy #0C3F8E (primary, dark: #7FB2FF), orange #EB5C2F (accent),
// red #D92D20, green #12B76A, amber #F79009. gray-* and bg-white flip in
// dark mode (see globals.css); use bg-[#FFFFFF] to keep something white.

export const CARD =
  "rounded-2xl border border-gray-200 bg-white shadow-sm shadow-gray-900/[0.03]";
export const CARD_HOVER =
  "transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5";
export const LINK_TEXT =
  "font-semibold text-[#0C3F8E] hover:underline dark:text-[#7FB2FF]";
export const PRIMARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-5 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none";
export const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50";

// Page title block: optional back link, title, subtitle and actions.
export const PageHeader = ({ title, subtitle, back, backLabel = "Back", actions, className = "" }) => (
  <div className={`mb-6 md:mb-8 ${className}`}>
    {back && (
      <Link
        href={back}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <HiChevronLeft className="text-lg" />
        {backLabel}
      </Link>
    )}
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500 md:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </div>
);

// Section title with an optional "See all" link.
export const SectionTitle = ({ title, subtitle, href, linkLabel = "See all", action, className = "" }) => (
  <div className={`mb-4 flex items-end justify-between gap-3 md:mb-5 ${className}`}>
    <div className="min-w-0">
      <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {action ||
      (href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]"
        >
          {linkLabel}
          <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
  </div>
);

export const EmptyState = ({
  icon,
  title = "Nothing here yet",
  text,
  action,
  className = "",
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center ${className}`}
  >
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EB5C2F]/10 text-3xl text-[#EB5C2F]">
      {icon || <HiOutlineInbox />}
    </span>
    <p className="mt-4 text-base font-semibold text-gray-900">{title}</p>
    {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

const BADGE_TONES = {
  gray: "bg-gray-100 text-gray-700",
  navy: "bg-[#0C3F8E]/10 text-[#0C3F8E] dark:text-[#7FB2FF]",
  green: "bg-[#12B76A]/10 text-[#067647] dark:text-[#47CD89]",
  amber: "bg-[#F79009]/10 text-[#B54708] dark:text-[#FDB022]",
  red: "bg-[#D92D20]/10 text-[#B42318] dark:text-[#F97066]",
  orange: "bg-[#EB5C2F]/10 text-[#C4320A] dark:text-[#FF8A5B]",
};

export const Badge = ({ tone = "gray", children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_TONES[tone] || BADGE_TONES.gray} ${className}`}
  >
    {children}
  </span>
);

// Maps an order / appointment status string to a badge tone.
export const statusTone = (status = "") => {
  const s = String(status).toLowerCase();
  if (/(deliver|complete|confirm|accept|success|paid|done)/.test(s)) return "green";
  if (/(cancel|reject|fail|declin)/.test(s)) return "red";
  if (/(pending|wait|placed|new|request)/.test(s)) return "amber";
  if (/(process|ship|way|picked|prepar|ready)/.test(s)) return "navy";
  return "gray";
};

export const StatusBadge = ({ status }) => (
  <Badge tone={statusTone(status)}>{status || "Unknown"}</Badge>
);

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);

// Standard page container width / padding for module pages.
export const PAGE_CONTAINER = "mx-auto w-full max-w-[1312px] px-4 sm:px-6 lg:px-8";
