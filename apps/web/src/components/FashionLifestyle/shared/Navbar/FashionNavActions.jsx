"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { IoMdHeartEmpty } from "react-icons/io";
import { LiaShoppingBagSolid } from "react-icons/lia";
import CartDrawer from "../Cart/CartDrawer";
import { useCart } from "../../context/CartContext";
import { NAV_ICON_BUTTON } from "@/components/shared/Navbar/navStyles";

const CountBadge = ({ count }) =>
  count > 0 ? (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EB5C2F] px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

// Wishlist and shopping bag buttons for the fashion section.
const FashionNavActions = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getCartCount } = useCart();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <>
      <Link
        href="/fashion-lifestyle/wishlist"
        aria-label="Wishlist"
        className={`${NAV_ICON_BUTTON} hidden text-[22px] sm:flex`}
      >
        <IoMdHeartEmpty />
        <CountBadge count={wishlistCount} />
      </Link>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        data-cart-target
        aria-label="Shopping bag"
        className={`${NAV_ICON_BUTTON} text-[22px]`}
      >
        <LiaShoppingBagSolid />
        <CountBadge count={getCartCount()} />
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default FashionNavActions;
