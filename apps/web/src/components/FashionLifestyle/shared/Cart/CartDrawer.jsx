"use client";

import CartItem from "./CartItem";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { HiArrowRight } from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import Drawer from "@/components/shared/Drawer/Drawer";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import {
  CartEmpty,
  PriceRow,
  PrimaryButton,
  formatTaka,
} from "@/components/shared/CartUI/CartUI";

const CartDrawer = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { cartItems, getCartCount, getCartTotal } = useCart();
  const { userInfo } = useSelector((state) => state.user);

  const count = getCartCount() || 0;
  const hasItems = cartItems?.length > 0;

  const handleCheckoutClick = () => {
    onClose();
    if (!userInfo?._id) return setIsModalOpen(true);
    router.push("/fashion-lifestyle/checkout");
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Your bag"
        subtitle={
          hasItems ? `${count} ${count === 1 ? "item" : "items"}` : undefined
        }
        footer={
          hasItems ? (
            <>
              <div className="space-y-2">
                <PriceRow label="Subtotal" value={formatTaka(getCartTotal())} strong />
                <p className="text-xs text-gray-500">
                  Delivery charge is added at checkout.
                </p>
              </div>
              <PrimaryButton onClick={handleCheckoutClick} className="mt-4">
                Proceed to checkout
                <HiArrowRight />
              </PrimaryButton>
            </>
          ) : null
        }
      >
        {hasItems ? (
          <CartItem />
        ) : (
          <CartEmpty
            title="Your bag is empty"
            text="Find something you love and add it to your bag."
            action={
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Continue shopping
              </button>
            }
          />
        )}
      </Drawer>

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <LoginModalDetails
            onClose={() => setIsModalOpen(false)}
            type="private-route"
          />
        </CommonModal>
      )}
    </>
  );
};

export default CartDrawer;
