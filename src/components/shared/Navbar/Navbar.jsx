"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useParams, usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { BsCartCheck } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import AccountMenu from "./AccountMenu";
import LoginButton from "../NavbarLogin/LoginButton";
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
  const params = useParams();

  // The menu remembers the path it was opened on, so it closes by itself
  // after navigating.
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const menuOpen = menuOpenOn === pathname;
  const setMenuOpen = (open) => setMenuOpenOn(open ? pathname : null);

  const userInfo = useSelector((state) => state.user.userInfo);

  // Order history lives inside each store, so the link only shows there.
  let ordersHref = "";
  if (params?.storeId && params?.customStoreId) {
    const store = `${params.store}/${params.storeId}/${params.customStoreId}`;
    if (pathname.startsWith("/food/store/")) {
      ordersHref = `/food/store/${store}/orders`;
    } else if (pathname.startsWith("/grocery/")) {
      ordersHref = `/grocery/${store}/orders`;
    } else if (pathname.startsWith("/medicine/")) {
      ordersHref = `/medicine/${store}/orders`;
    }
  }

  const isActive = (match) => pathname.startsWith(match);

  const accountItems = [
    ordersHref && {
      href: ordersHref,
      label: "My orders",
      Icon: BsCartCheck,
    },
    !ordersHref && {
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

          {userInfo?._id && <AccountMenu items={accountItems} />}

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
