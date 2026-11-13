"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { HiChevronDown } from "react-icons/hi";
import { useUser } from "@/hooks/fetch-data/useUser";

// Avatar button + dropdown used by every navbar.
// `items`: [{ href, label, Icon }]
const AccountMenu = ({ items }) => {
  const pathname = usePathname();

  // Remember the path the menu was opened on, so it closes after navigating.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const setOpen = (value) => setOpenOn(value ? pathname : null);

  const ref = useRef();
  const { handleUserLogout } = useUser();
  const userInfo = useSelector((state) => state.user.userInfo);
  const userName = userInfo?.customer_name || "Account";

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenOn(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-gray-200 p-1 transition-colors hover:bg-gray-50 md:pr-3"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0C3F8E] text-sm font-semibold uppercase text-white">
          {userName.charAt(0)}
        </span>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-800 md:block">
          {userName}
        </span>
        <HiChevronDown
          className={`hidden text-gray-500 transition-transform md:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-30 w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10"
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="truncate text-sm font-semibold text-gray-900">
              {userName}
            </p>
          </div>
          <ul className="p-1.5">
            {items.map(({ href, label, Icon }) => (
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
  );
};

export default AccountMenu;
