"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  const { cartItems } = useCart();
  const favouriteFashionItems = useSelector(
    (state) => state.userChoice.favouriteFashionItems,
  );

  return (
    <>
      <Link
        href="/fashion-lifestyle/wishlist"
        aria-label="Wishlist"
        className={`${NAV_ICON_BUTTON} hidden text-[22px] sm:flex`}
      >
        <IoMdHeartEmpty />
        <CountBadge count={favouriteFashionItems?.length} />
      </Link>

      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        aria-label="Shopping bag"
        className={`${NAV_ICON_BUTTON} text-[22px]`}
      >
        <LiaShoppingBagSolid />
        <CountBadge count={cartItems?.length} />
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default FashionNavActions;
