import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";

const APP_URL =
  "https://play.google.com/store/apps/details?id=com.bitsnotension";
const PHONE = "+88 01719662995";
const PHONE_TEL = "+8801719662995";
const EMAIL = "notensionxyz@gmail.com";

// Add the page URLs here; an icon only shows once it has a URL.
const SOCIAL_LINKS = [
  { label: "Facebook", url: "", Icon: BsFacebook },
  { label: "Instagram", url: "", Icon: BsInstagram },
  { label: "LinkedIn", url: "", Icon: BsLinkedin },
  { label: "X", url: "", Icon: BsTwitterX },
].filter((s) => s.url);

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Grocery", href: "/grocery/home" },
      { label: "Medicine", href: "/medicine/home" },
      { label: "Food", href: "/food" },
      { label: "Fashion & Lifestyle", href: "/fashion-lifestyle" },
    ],
  },
  {
    title: "Healthcare",
    links: [
      { label: "Find doctors", href: "/medical-services/doctor" },
      { label: "Hospitals", href: "/medical-services/hospital" },
      { label: "Diagnostic centers", href: "/medical-services/diagnostic" },
      { label: "All care services", href: "/all-care-services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Marketing policy", href: "/marketing-policy" },
      { label: "Get the app", href: APP_URL, external: true },
    ],
  },
];

const PAYMENTS = [
  { src: "/png/bkash.png", alt: "bKash" },
  { src: "/png/nagad.png", alt: "Nagad" },
  { src: "/png/cash-on-delivery.png", alt: "Cash on delivery" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1312px] px-4 pb-8 pt-12 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Image
              src="/png/notension-logo.png"
              alt="NoTension"
              width={180}
              height={32}
              className="h-9 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Groceries, medicine, food and fashion delivered to your door,
              plus doctors, hospitals, nurses, ambulances and blood donors when
              you need them.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href={APP_URL} target="_blank" prefetch={false}>
                <Image
                  src="/png/playstore.png"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-10 w-auto rounded-md"
                />
              </Link>
              <Link href={APP_URL} target="_blank" prefetch={false}>
                <Image
                  src="/png/applestore.png"
                  alt="Download on the App Store"
                  width={135}
                  height={40}
                  className="h-10 w-auto rounded-md"
                />
              </Link>
            </div>
            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-5 flex gap-2">
                {SOCIAL_LINKS.map(({ label, url, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map(({ title, links }) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map(({ label, href, external }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        {...(external
                          ? { target: "_blank", prefetch: false }
                          : {})}
                        className="text-sm text-gray-600 transition-colors hover:text-[#D9481C] dark:hover:text-[#FF8A5B]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact us</h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <LuMapPin className="mt-0.5 shrink-0 text-base text-[#EB5C2F]" />
                <span className="leading-relaxed">
                  Jobeda Villa (behind Meghna Bank, 2nd floor), Holding 120,
                  Mirzarpool, Muradpur, Panchlaish, Chattogram, Bangladesh
                </span>
              </li>
              <li>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="flex items-center gap-3 transition-colors hover:text-gray-900"
                >
                  <LuPhone className="shrink-0 text-base text-[#EB5C2F]" />
                  {PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 break-all transition-colors hover:text-gray-900"
                >
                  <LuMail className="shrink-0 text-base text-[#EB5C2F]" />
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {year} NoTension. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              We accept
            </span>
            {PAYMENTS.map(({ src, alt }) => (
              <span
                key={alt}
                className="flex h-10 items-center rounded-md border border-gray-200 bg-[#FFFFFF] px-2"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={56}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
