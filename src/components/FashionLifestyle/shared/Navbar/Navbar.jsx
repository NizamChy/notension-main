"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { BsCartCheck } from "react-icons/bs";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import { IoMdClose, IoMdHeartEmpty } from "react-icons/io";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { useParams, usePathname, useRouter } from "next/navigation";
import CartDrawer from "../Cart/CartDrawer";
import Sidebar from "../../Sidebar/Sidebar";
import ProductSearchbar from "./ProductSearchbar";
import { useCart } from "../../context/CartContext";
import LocationModal from "../LocationModal/LocationModal";
import AccountMenu from "@/components/shared/Navbar/AccountMenu";
import LoginButton from "@/components/shared/NavbarLogin/LoginButton";
import ThemeToggle from "@/components/shared/ThemeToggle/ThemeToggle";

const ACCOUNT_ITEMS = [
  { href: "/fashion-lifestyle/orders", label: "My orders", Icon: BsCartCheck },
  { href: "/fashion-lifestyle/wishlist", label: "Wishlist", Icon: IoMdHeartEmpty },
  { href: "/fashion-lifestyle/user/profile", label: "Profile", Icon: CgProfile },
  {
    href: "/fashion-lifestyle/user/update-address",
    label: "Update address",
    Icon: IoLocationOutline,
  },
];

const iconButton =
  "relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900";

const CountBadge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EB5C2F] px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { cartItems } = useCart();
  const userInfo = useSelector((state) => state.user.userInfo);
  const favouriteFashionItems = useSelector(
    (state) => state.userChoice.favouriteFashionItems
  );

  // Inside a shop the shop's name replaces the NoTension logo.
  const inShop = pathname?.includes("shop") && params?.shopSlugId;
  const shopWords = inShop
    ? params.shopSlugId.split("_")[0].split("-").filter(Boolean)
    : [];

  // Shop sub-page → shop home → fashion home → site home.
  const handleLogoClick = () => {
    const basePath = `/fashion-lifestyle/shop/${params?.shopSlugId}`;

    if (pathname.startsWith(basePath) && pathname !== basePath) {
      return router.push(basePath);
    }
    if (pathname === basePath) return router.push("/fashion-lifestyle");
    if (pathname === "/fashion-lifestyle") return router.push("/");
    router.push("/fashion-lifestyle");
  };

  return (
    <>
      <div className="h-16 lg:h-[72px]">
        <div className="fixed inset-x-0 top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-md">
          <nav className="relative mx-auto flex h-16 max-w-screen-2xl items-center gap-2 px-4 sm:gap-3 lg:h-[72px] lg:gap-6 lg:px-8">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open categories"
              className={`${iconButton} -ml-2 text-xl lg:hidden`}
            >
              <HiMenuAlt2 />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={handleLogoClick}
                aria-label={inShop ? "Shop home" : "Fashion home"}
                className="min-w-0 shrink-0"
              >
                {inShop ? (
                  <span className="block truncate text-lg font-bold capitalize tracking-tight text-gray-900 md:text-2xl">
                    {shopWords.join(" ")}
                  </span>
                ) : (
                  <Image
                    width={224}
                    height={40}
                    priority
                    src="/png/notension-logo.png"
                    alt="NoTension"
                    className="h-6 w-auto sm:h-7 lg:h-9"
                  />
                )}
              </button>
              <span aria-hidden className="hidden h-6 w-px bg-gray-200 xl:block" />
              <Link
                href="/fashion-lifestyle"
                className="hidden items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 xl:inline-flex"
              >
                <span className="h-2 w-2 rounded-full bg-[#EB5C2F]" />
                Fashion
              </Link>
            </div>

            {/* Desktop search */}
            <div className="mx-auto hidden min-w-0 max-w-xl flex-1 lg:block">
              <ProductSearchbar />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 lg:ml-0">
              <div className="hidden xl:block">
                <LocationModal />
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label={searchOpen ? "Close search" : "Search"}
                aria-expanded={searchOpen}
                className={`${iconButton} text-xl lg:hidden`}
              >
                {searchOpen ? <IoMdClose /> : <IoSearch />}
              </button>

              <ThemeToggle />

              <Link
                href="/fashion-lifestyle/wishlist"
                aria-label="Wishlist"
                className={`${iconButton} hidden text-[22px] sm:flex`}
              >
                <IoMdHeartEmpty />
                <CountBadge count={favouriteFashionItems?.length} />
              </Link>

              <button
                type="button"
                onClick={() => setIsCartOpen(!isCartOpen)}
                aria-label="Shopping bag"
                className={`${iconButton} text-[22px]`}
              >
                <LiaShoppingBagSolid />
                <CountBadge count={cartItems?.length} />
              </button>

              {userInfo?._id ? (
                <div className="ml-1">
                  <AccountMenu items={ACCOUNT_ITEMS} />
                </div>
              ) : (
                <div className="ml-1">
                  <LoginButton compact />
                </div>
              )}
            </div>

            {/* Mobile search */}
            {searchOpen && (
              <div className="absolute inset-x-0 top-full border-b border-gray-200 bg-white py-3 shadow-md lg:hidden">
                <ProductSearchbar />
              </div>
            )}
          </nav>
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  );
};

export default Navbar;
