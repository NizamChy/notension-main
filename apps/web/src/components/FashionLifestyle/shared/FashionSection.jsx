import React from "react";
import Link from "next/link";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { PAGE_CONTAINER } from "@/components/shared/UI/UI";

/** Shared page container for the fashion module (width, gutters, rhythm). */
export const FASHION_CONTAINER = PAGE_CONTAINER;

const FashionSection = ({ children, className = "", innerClassName = "" }) => {
  return (
    <section className={`py-8 md:py-12 ${className}`}>
      <div className={`${FASHION_CONTAINER} ${innerClassName}`}>{children}</div>
    </section>
  );
};

/** Round prev/next buttons for Swiper rails (Swiper finds them by class). */
const NAV_BUTTON =
  "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 [&.swiper-button-disabled]:cursor-not-allowed [&.swiper-button-disabled]:opacity-40";

export const SliderNav = ({ prevClass, nextClass, label = "items" }) => (
  <div className="hidden shrink-0 items-center gap-2 md:flex">
    <button
      type="button"
      aria-label={`Previous ${label}`}
      className={`${prevClass} ${NAV_BUTTON}`}
    >
      <HiChevronLeft />
    </button>
    <button
      type="button"
      aria-label={`Next ${label}`}
      className={`${nextClass} ${NAV_BUTTON}`}
    >
      <HiChevronRight />
    </button>
  </div>
);

/** Breadcrumb trail. `items`: [{ label, href? }] — the last one is current. */
export const Breadcrumbs = ({ items = [], className = "" }) => (
  <nav aria-label="Breadcrumb" className={`mb-3 ${className}`}>
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="capitalize transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={last ? "page" : undefined}
                className={`capitalize ${last ? "font-medium text-gray-900" : ""}`}
              >
                {item.label}
              </span>
            )}
            {!last && <HiChevronRight className="text-gray-400" aria-hidden />}
          </li>
        );
      })}
    </ol>
  </nav>
);

/** Turns a URL slug ("mens-wear") into a readable label ("mens wear"). */
export const unslug = (value = "") =>
  decodeURIComponent(String(value || "")).replace(/-/g, " ");

export default FashionSection;
