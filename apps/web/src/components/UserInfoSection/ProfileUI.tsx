import React, { type ElementType, type ReactNode } from "react";

// Shared pieces for the profile and update-address pages.

const initialsOf = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";

type AvatarProps = { name?: string; className?: string };

export const Avatar = ({ name, className = "h-16 w-16 text-xl" }: AvatarProps) => (
  <span
    aria-hidden="true"
    className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white ring-4 ring-[rgb(var(--surface))] ${className}`}
  >
    {initialsOf(name)}
  </span>
);

type ProfileHeaderProps = {
  name?: string;
  phone?: string;
  /** Element for the name (a heading on the profile page). */
  as?: ElementType;
};

// Navy banner with the avatar, name and phone.
export const ProfileHeader = ({ name, phone, as: Heading = "p" }: ProfileHeaderProps) => (
  <div className="relative">
    <div className="h-20 bg-linear-to-r from-[#0C3F8E] to-[#1A5BC4] md:h-24" />
    <div className="-mt-8 flex flex-col items-center px-5 text-center md:-mt-10">
      <Avatar name={name} className="h-16 w-16 text-xl md:h-20 md:w-20 md:text-2xl" />
      <Heading className="mt-3 wrap-break-word text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
        {name || "Your profile"}
      </Heading>
      {phone && (
        <p className="mt-0.5 text-sm tabular-nums text-gray-500">{phone}</p>
      )}
    </div>
  </div>
);

type InfoRowProps = { icon: ReactNode; label: ReactNode; value?: ReactNode };

export const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3 py-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base text-primary dark:text-[#7FB2FF]">
      {icon}
    </span>
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-0.5 wrap-break-word text-sm font-medium text-gray-900">
        {value || <span className="font-normal text-gray-400">Not added</span>}
      </dd>
    </div>
  </div>
);
