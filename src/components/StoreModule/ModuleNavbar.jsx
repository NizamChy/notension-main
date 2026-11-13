"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useParams, usePathname, useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { BsCartCheck } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import AccountMenu from "@/components/shared/Navbar/AccountMenu";
import LoginButton from "@/components/shared/NavbarLogin/LoginButton";
import ThemeToggle from "@/components/shared/ThemeToggle/ThemeToggle";

const MODULES = {
  grocery: { label: "Grocery", home: "/grocery/home", dot: "bg-primaryGrocery" },
  medicine: { label: "Medicine", home: "/medicine/home", dot: "bg-primaryMedicine" },
  food: { label: "Food", home: "/food", dot: "bg-primaryFood" },
};

// Top bar for the store modules (grocery, medicine, food).
// - `drawer`: the module's mobile category drawer (shows its own hamburger)
// - `center`: search box (optional)
// - `actions`: extra controls before the theme toggle, e.g. location picker
// - `storePrefix`: path segment before the store params ("/food/store" for food)
// - `wishlist`: show the store wishlist link in the account menu
const ModuleNavbar = ({
  module,
  drawer,
  center,
  actions,
  storePrefix,
  wishlist,
}) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const userInfo = useSelector((state) => state.user.userInfo);

  const { label, home, dot } = MODULES[module];
  const inStore = Boolean(params?.storeId && params?.customStoreId);
  const storePath = `${storePrefix}/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

  // Inside a store page the logo goes back to the store, otherwise home.
  const handleLogoClick = () => {
    router.push(
      inStore && pathname.startsWith(storePath) && pathname !== storePath
        ? storePath
        : "/",
    );
  };

  const accountItems = [
    inStore && { href: `${storePath}/orders`, label: "My orders", Icon: BsCartCheck },
    inStore &&
      wishlist && {
        href: `${storePath}/favorite-items`,
        label: "Wishlist",
        Icon: MdFavoriteBorder,
      },
    { href: "/user/profile", label: "Profile", Icon: CgProfile },
    { href: "/user/update-address", label: "Update address", Icon: IoLocationOutline },
  ].filter(Boolean);

  return (
    <nav className="fixed inset-x-0 top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 lg:h-[72px] lg:gap-6 lg:px-8">
        {drawer}

        <div className={`${center ? "hidden md:flex" : "flex"} shrink-0 items-center gap-3`}>
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="NoTension home"
            className="shrink-0"
          >
            <Image
              width={224}
              height={40}
              priority
              src="/png/notension-logo.png"
              alt="NoTension"
              className="h-7 w-auto lg:h-9"
            />
          </button>
          <span aria-hidden className="hidden h-6 w-px bg-gray-200 lg:block" />
          <Link
            href={home}
            className="hidden items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 lg:inline-flex"
          >
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            {label}
          </Link>
        </div>

        {center ? (
          <div className="mx-auto min-w-0 flex-1 md:max-w-xl">{center}</div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {actions}
          <ThemeToggle />
          {userInfo?._id ? (
            <AccountMenu items={accountItems} />
          ) : (
            <LoginButton compact />
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModuleNavbar;
