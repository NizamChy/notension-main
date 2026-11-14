"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { HiArrowRight } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import CartItems from "./CartItems";
import { StoreSwitchModal, storePath } from "./storeSwitch";
import CartSummary from "./CartSummary";
import { CART_MODULES } from "./cartModules";
import Drawer from "../shared/Drawer/Drawer";
import CommonModal from "../shared/CommonModal/CommonModal";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import { CartEmpty, PrimaryButton, formatTaka } from "../shared/CartUI/CartUI";

// Stable empty list so the selector does not return a new array each call.
const NO_ITEMS = [];

// Floating cart button + cart drawer for the grocery, medicine and food
// stores.
const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const userInfo = useSelector((state) => state.user.userInfo);
  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const moduleName = currentModule?.toLowerCase();
  const config = CART_MODULES[moduleName];

  const items = useSelector((state) =>
    config ? state.cart[config.itemsKey] : NO_ITEMS,
  );
  const total = useSelector((state) => (config ? state.cart[config.totalKey] : 0));
  const visitedStore = useSelector((state) =>
    config ? state.dashboard[config.visitedStoreKey] : null,
  );
  // The store the items were added from, which may not be the page's store.
  const cartStore = useSelector((state) =>
    config ? state.cart[config.storeInfoKey] : null,
  );

  const count = items?.length || 0;
  const hasItems = count > 0;
  const cartStorePath = storePath(moduleName, cartStore);
  const fromOtherStore =
    hasItems && cartStore?._id && cartStore._id !== visitedStore?._id;
  const store = cartStore?._id ? cartStore : visitedStore;

  const handleCheckout = () => {
    setIsOpen(false);
    if (!userInfo?._id) return setIsModalOpen(true);

    const current = `${params?.store}/${params?.storeId}/${params?.customStoreId}`;
    const base =
      cartStorePath ||
      (moduleName === "food" ? `/food/store/${current}` : `/${moduleName}/${current}`);
    router.push(`${base}/checkout`);
  };

  const onCheckout = pathname?.endsWith("/checkout");

  return (
    <>
      {/* Floating cart: a slim tab on the right edge on lg+ (store pages keep
          a right gutter for it) and a pill in the bottom-right corner below.
          Hidden at checkout, which already lists the cart. */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
        className={`fixed bottom-4 right-4 z-40 items-center overflow-hidden rounded-full bg-[#0C3F8E] text-white shadow-lg shadow-[#0C3F8E]/30 transition-transform hover:-translate-y-0.5 lg:bottom-auto lg:right-0 lg:top-1/2 lg:w-[76px] lg:-translate-y-1/2 lg:flex-col lg:rounded-none lg:rounded-s-2xl lg:hover:-translate-y-1/2 ${
          onCheckout ? "hidden" : "flex"
        }`}
      >
        <span className="flex items-center gap-2 py-2.5 pl-3.5 pr-3 lg:flex-col lg:gap-1 lg:px-2 lg:pb-2 lg:pt-3">
          <span className="relative">
            <HiOutlineShoppingBag className="text-xl" />
            {hasItems && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EB5C2F] px-1 text-[10px] font-bold leading-none">
                {count}
              </span>
            )}
          </span>
          <span className="text-xs font-medium lg:text-[11px]">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </span>
        <span className="self-stretch bg-white/15 px-3 py-2.5 text-xs font-semibold tabular-nums lg:px-1 lg:py-1.5 lg:text-center lg:text-[11px]">
          {formatTaka(total)}
        </span>
      </button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Your cart"
        subtitle={
          hasItems
            ? `${count} ${count === 1 ? "item" : "items"}${
                store?.shop_name ? ` from ${store.shop_name}` : ""
              }`
            : undefined
        }
        headerExtra={
          fromOtherStore ? (
            <p className="border-b border-[#2E6FD8]/20 bg-[#EEF4FF] px-5 py-2.5 text-xs font-medium text-[#0C3F8E] dark:bg-[#2E6FD8]/10 dark:text-[#9DC1FF]">
              These items are from {cartStore.shop_name || "another store"}.{" "}
              {cartStorePath && (
                <Link
                  href={cartStorePath}
                  onClick={() => setIsOpen(false)}
                  className="font-semibold underline underline-offset-2"
                >
                  Go to store
                </Link>
              )}
            </p>
          ) : hasItems && store?.delivery_notice ? (
            <p className="border-b border-[#F5B700]/30 bg-[#FFF8E1] px-5 py-2.5 text-xs font-medium text-[#7A5A00] dark:bg-[#F5B700]/10 dark:text-[#F5D06B]">
              {store.delivery_notice}
            </p>
          ) : null
        }
        footer={
          hasItems ? (
            <>
              <CartSummary key={moduleName} moduleName={moduleName} />
              <PrimaryButton onClick={handleCheckout} className="mt-4">
                Checkout
                <HiArrowRight />
              </PrimaryButton>
            </>
          ) : null
        }
      >
        {hasItems && config ? (
          <CartItems key={moduleName} moduleName={moduleName} />
        ) : (
          <CartEmpty
            text="Browse the store and add items to your cart."
            action={
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Continue shopping
              </button>
            }
          />
        )}
      </Drawer>

      <StoreSwitchModal />

      <CommonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginModalDetails onClose={() => setIsModalOpen(false)} type="cart" />
      </CommonModal>
    </>
  );
};

export default Cart;
