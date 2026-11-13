import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LuBell, LuMapPinned, LuSmartphone } from "react-icons/lu";
import { APP_URL } from "./constants";

const FEATURES = [
  { Icon: LuMapPinned, label: "Live order tracking" },
  { Icon: LuBell, label: "Offers and order updates" },
  { Icon: LuSmartphone, label: "Nurse, ambulance & blood donor requests" },
];

const AppDownload = () => (
  <section
    id="get-app"
    className="scroll-mt-28 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EB5C2F] to-[#F5873F] px-6 py-10 text-white md:px-12 md:py-12">
    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
    <div className="pointer-events-none absolute -bottom-28 right-40 h-60 w-60 rounded-full bg-white/10" />

    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-xl">
        <h2 className="text-2xl md:text-[32px] md:leading-tight font-bold">
          Get the NoTension app
        </h2>
        <p className="mt-2 text-white/85">
          Everything on the website, plus services that are only in the app.
        </p>
        <ul className="mt-5 flex flex-col gap-2.5">
          {FEATURES.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                <Icon />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={APP_URL} target="_blank" prefetch={false}>
          <Image
            src="/png/playstore.png"
            alt="Get it on Google Play"
            width={170}
            height={52}
            className="h-[52px] w-auto rounded-lg transition hover:opacity-90"
          />
        </Link>
        <Link href={APP_URL} target="_blank" prefetch={false}>
          <Image
            src="/png/applestore.png"
            alt="Download on the App Store"
            width={170}
            height={52}
            className="h-[52px] w-auto rounded-lg transition hover:opacity-90"
          />
        </Link>
      </div>
    </div>
  </section>
);

export default AppDownload;
