"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { BsCartCheck } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { HiChevronDown, HiMenuAlt3, HiX } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import LoginButton from "../NavbarLogin/LoginButton";
import { useUser } from "@/hooks/fetch-data/useUser";
import LocationModal from "../LocationModal/LocationModal";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

// Main sections. `match` is the path prefix that marks the link active.
const NAV_LINKS = [
  { label: "Grocery", href: "/grocery/home", match: "/grocery" },
  { label: "Medicine", href: "/medicine/home", match: "/medicine" },
  { label: "Food", href: "/food", match: "/food" },
  { label: "Fashion", href: "/fashion-lifestyle", match: "/fashion-lifestyle" },
  { label: "Doctors", href: "/medical-services/doctor", match: "/medical-services" },
  { label: "Care services", href: "/all-care-services", match: "/all-care-services" },
];

const Navbar = () => {
  const pathname = usePathname();

  // Each menu remembers the path it was opened on, so it closes by itself
  // after navigating.
  const [accountOpenOn, setAccountOpenOn] = useState(null);
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const accountOpen = accountOpenOn === pathname;
  const menuOpen = menuOpenOn === pathname;
  const setAccountOpen = (open) => setAccountOpenOn(open ? pathname : null);
  const setMenuOpen = (open) => setMenuOpenOn(open ? pathname : null);

  const accountRef = useRef();

  const { handleUserLogout } = useUser();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userName = userInfo?.customer_name || "Account";

  // Order history lives under each store section.
  let category = "";
  if (pathname.includes("/grocery")) category = "grocery";
  else if (pathname.includes("/medicine")) category = "medicine";
  else if (pathname.includes("/food")) category = "food";
  else if (pathname.includes("/all-care-services")) category = "all-care-services";

  useEffect(() => {
    const close = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpenOn(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const isActive = (match) => pathname.startsWith(match);

  const accountItems = [
    category && {
      href: `/${category}/store/orders`,
      label: "My orders",
      Icon: BsCartCheck,
    },
    !category && {
      href: "/medical-services/doctor/booked-appointment",
      label: "Booked appointments",
      Icon: FaUserDoctor,
    },
    { href: "/user/profile", label: "Profile", Icon: CgProfile },
    {
      href: "/user/update-address",
      label: "Update address",
      Icon: IoLocationOutline,
    },
  ].filter(Boolean);

  return (
    <nav className="fixed inset-x-0 top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1312px] items-center gap-3 px-4 lg:h-[72px] lg:gap-6">
        <Link href="/" aria-label="NoTension home" className="shrink-0">
          <Image
            width={224}
            height={40}
            priority
            src="/png/notension-logo.png"
            alt="NoTension"
            className="h-7 w-auto lg:h-9"
          />
        </Link>

        {/* Section links, large screens */}
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map(({ label, href, match }) => (
            <li key={href}>
              <Link
                href={href}
                className={`rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
                  isActive(match)
                    ? "bg-[#EB5C2F]/10 text-[#D9481C] dark:text-[#FF8A5B]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LocationModal />

          <ThemeToggle />

          {!userInfo?._id && <LoginButton />}

          {userInfo?._id && (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-1 transition-colors hover:bg-gray-50 md:pr-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0C3F8E] text-sm font-semibold uppercase text-white">
                  {userName.charAt(0)}
                </span>
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-800 md:block">
                  {userName}
                </span>
                <HiChevronDown
                  className={`hidden text-gray-500 transition-transform md:block ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10"
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {userName}
                    </p>
                  </div>
                  <ul className="p-1.5">
                    {accountItems.map(({ href, label, Icon }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          role="menuitem"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Icon className="text-base text-gray-400" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 p-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleUserLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#D92D20] transition-colors hover:bg-[#D92D20]/10"
                    >
                      <BiLogOut className="text-base" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section menu toggle, below xl */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-700 transition-colors hover:bg-gray-100 xl:hidden"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white xl:hidden">
          <ul className="mx-auto grid max-w-[1312px] grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
            {NAV_LINKS.map(({ label, href, match }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive(match)
                      ? "bg-[#EB5C2F]/10 text-[#D9481C] dark:text-[#FF8A5B]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
