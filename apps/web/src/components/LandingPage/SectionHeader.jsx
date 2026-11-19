import React from "react";

/** Eyebrow + heading + optional supporting line, shared by every section. */
const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6 md:mb-8">
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.14em] text-[#EB5C2F]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1.5 text-2xl md:text-[32px] md:leading-tight font-bold text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm md:text-base text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {action}
  </div>
);

export default SectionHeader;
