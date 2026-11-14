import React from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

/**
 * Section heading for the fashion module: title, optional subtitle and a
 * right-side "View all" link or custom action (e.g. slider arrows).
 */
const Title = ({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  action,
  className = "",
}) => {
  return (
    <div
      className={`mb-5 flex items-end justify-between gap-4 md:mb-6 ${className}`}
    >
      <div className="min-w-0">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 md:text-base">{subtitle}</p>
        )}
      </div>

      {(action || href) && (
        <div className="flex shrink-0 items-center gap-3">
          {href && (
            <Link
              href={href}
              className="group inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]"
            >
              {linkLabel}
              <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          {action}
        </div>
      )}
    </div>
  );
};

export default Title;
