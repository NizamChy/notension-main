"use client";

import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";
import { PAGE_CONTAINER } from "@/components/shared/UI/UI";

// Shared layout primitives for every Medical Services page, so all pages use
// the same container width, gutters, vertical rhythm and heading style.

// Page title band under the navbar: eyebrow, title and a supporting line.
export const MedicalPageHeader = ({
  title,
  subtitle,
  eyebrow = "Medical services",
  back,
  backLabel = "Back",
}) => (
  <div className="border-b border-gray-200 bg-gray-50">
    <div className={`${PAGE_CONTAINER} py-6 md:py-8`}>
      {back && (
        <Link
          href={back}
          className="mb-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <LuChevronLeft className="text-base" />
          {backLabel}
        </Link>
      )}
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EB5C2F]">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const MedicalContainer = ({ children, className = "" }) => (
  <div className={`${PAGE_CONTAINER} ${className}`}>{children}</div>
);

// Page body: same container plus consistent top/bottom padding and the same
// gap between every section on the page.
export const MedicalPageBody = ({ children, className = "" }) => (
  <MedicalContainer
    className={`space-y-10 py-6 md:space-y-14 md:py-10 ${className}`}
  >
    {children}
  </MedicalContainer>
);

// Section heading with an optional supporting line and right-hand action.
export const MedicalSectionTitle = ({
  children,
  subtitle,
  action,
  className = "",
}) => (
  <div
    className={`mb-4 flex items-end justify-between gap-3 md:mb-5 ${className}`}
  >
    <div className="min-w-0">
      <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
        {children}
      </h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

// Grid used for every list of doctor / center cards: items stretch so all
// cards in a row share top and height.
export const MedicalCardGrid = ({ children, className = "" }) => (
  <div
    className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 ${className}`}
  >
    {children}
  </div>
);
