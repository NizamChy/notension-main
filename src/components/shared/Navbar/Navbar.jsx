"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useParams, usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { BsCartCheck } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import AccountMenu from "./AccountMenu";
import { NAV_ICON_BUTTON } from "./navStyles";
import LoginButton from "../NavbarLogin/LoginButton";
import LocationModal from "../LocationModal/LocationModal";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SearchBar from "@/components/StoreModule/SearchBar";
import ProductSearchbar from "@/components/FashionLifestyle/shared/Navbar/ProductSearchbar";

// Main sections. `match` is the path prefix that marks the link active.
const NAV_LINKS = [
  { label: "Grocery", href: "/grocery/home", match: "/grocery" },
  { label: "Medicine", href: "/medicine/home", match: "/medicine" },
  { label: "Food", href: "/food", match: "/food" },
  { label: "Fashion", href: "/fashion-lifestyle", match: "/fashion-lifestyle" },
  { label: "Doctors", href: "/medical-services/doctor", match: "/medical-services" },
  { label: "Care services", href: "/all-care-services", match: "/all-care-services" },
];

// Search boxes the navbar can open. `close` hides the panel after a search.
const SEARCHES = {
  grocery: (close) => (
    <SearchBar moduleName="grocery" autoFocus onSubmitted={close} />
  ),
  medicine: (close) => (
    <SearchBar moduleName="medicine" autoFocus onSubmitted={close} />
  ),
  fashion: (close) => <ProductSearchbar autoFocus onSubmitted={close} />,
};

const FASHION_ACCOUNT_ITEMS = [
  { href: "/fashion-lifestyle/orders", label: "My orders", Icon: BsCartCheck },
  { href: "/fashion-lifestyle/wishlist", label: "Wishlist", Icon: IoMdHeartEmpty },
  { href: "/fashion-lifestyle/user/profile", label: "Profile", Icon: CgProfile },
  {
    href: "/fashion-lifestyle/user/update-address",
    label: "Update address",
    Icon: IoLocationOutline,
  },
];

// The site-wide top bar.
// - `search`: "grocery" | "medicine" | "fashion" adds a search button that
//   opens the search box in place of the bar
// - `leading`: control before the logo (e.g. a category drawer button)
// - `actions`: extra buttons before the account menu (e.g. shopping bag)
const Navbar = ({ search, leading, actions }) => {
  const pathname = usePathname();
  const params = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);

  // Panels remember the path they were opened on, so they close by
  // themselves after navigating.
  const [menuOpenOn, setMenuOpenOn] = useState(null);
  const [searchOpenOn, setSearchOpenOn] = useState(null);
  const menuOpen = menuOpenOn === pathname;
  const searchOpen = Boolean(search) && searchOpenOn === pathname;
  const closeSearch = () => setSearchOpenOn(null);
  const openSearch = () => {
    setMenuOpenOn(null);
    setSearchOpenOn(pathname);
  };

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => e.key === "Escape" && setSearchOpenOn(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // Account menu links depend on the section. Order history and wishlists
  // live inside each store, so those links only show there.
  let accountItems;
  if (pathname.startsWith("/fashion-lifestyle")) {
    accountItems = FASHION_ACCOUNT_ITEMS;
  } else {
    let storeBase = "";
    let hasWishlist = false;
    if (params?.storeId && params?.customStoreId) {
      const store = `${params.store}/${params.storeId}/${params.customStoreId}`;
      if (pathname.startsWith("/food/store/")) {
        storeBase = `/food/store/${store}`;
      } else if (pathname.startsWith("/grocery/") || pathname.startsWith("/medicine/")) {
        storeBase = `/${pathname.split("/")[1]}/${store}`;
        hasWishlist = true;
      }
    }

    accountItems = [
      storeBase && {
        href: `${storeBase}/orders`,
        label: "My orders",
        Icon: BsCartCheck,
      },
      hasWishlist && {
        href: `${storeBase}/favorite-items`,
        label: "Wishlist",
        Icon: IoMdHeartEmpty,
      },
      !storeBase && {
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
  }

  const isActive = (match) => pathname.startsWith(match);

  return (
    <nav className="fixed inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      {searchOpen ? (
        <div className="mx-auto flex h-16 max-w-[1312px] items-center gap-2 px-4 lg:h-[72px] lg:gap-4">
          <div className="mx-auto w-full min-w-0 max-w-2xl">
            {SEARCHES[search](closeSearch)}
          </div>
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className={`${NAV_ICON_BUTTON} -mr-2 text-xl`}
          >
            <HiX />
          </button>
        </div>
      ) : (
        <div className="mx-auto flex h-16 max-w-[1312px] items-center gap-1 px-4 sm:gap-3 lg:h-[72px] lg:gap-6">
          {leading}

          <Link href="/" aria-label="NoTension home" className="shrink-0">
            <Image
              width={224}
              height={40}
              priority
              src="/png/notension-logo.png"
              alt="NoTension"
              className="h-6 w-auto sm:h-7 lg:h-9"
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

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            {/* With extra buttons the section links need the room, so the
                location pill waits for wider screens. */}
            <div
              className={`mr-1 hidden ${
                search || actions ? "2xl:block" : "lg:block"
              }`}
            >
              <LocationModal />
            </div>

            {search && (
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search"
                className={`${NAV_ICON_BUTTON} text-xl`}
              >
                <IoSearch />
              </button>
            )}

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {actions}

            <div className="ml-1">
              {userInfo?._id ? (
                <AccountMenu items={accountItems} />
              ) : (
                <LoginButton compact />
              )}
            </div>

            {/* Section menu toggle, below xl */}
            <button
              type="button"
              onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`${NAV_ICON_BUTTON} -mr-2 text-xl xl:hidden`}
            >
              {menuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      )}

      {menuOpen && !searchOpen && (
        <div className="border-t border-gray-200 bg-white xl:hidden">
          <div className="mx-auto max-w-[1312px] px-4 py-3">
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
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
            {/* Theme toggle lives here on phones to save space in the bar */}
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 px-3 pt-3 sm:hidden">
              <span className="text-sm font-medium text-gray-700">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
