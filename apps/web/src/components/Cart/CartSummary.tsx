"use client";

import React from "react";
import { useModuleCart } from "@/stores/useModuleCart";
import type { CartModule } from "@/stores/cartStore";
import { CART_MODULES } from "./cartModules";
import { PriceRow, formatTaka } from "../shared/CartUI/CartUI";

type Props = { moduleName: CartModule };

// Subtotal, delivery, discount and total for the cart drawer.
// Render with key={moduleName} (see CartItems).
const CartSummary = ({ moduleName }: Props) => {
  const { useOrder } = CART_MODULES[moduleName];
  const { shippingCharge, discount, grandTotal } = useOrder();

  const { total } = useModuleCart(moduleName);

  return (
    <div className="space-y-2">
      <PriceRow label="Subtotal" value={formatTaka(total)} />
      <PriceRow label="Delivery charge" value={formatTaka(shippingCharge)} />
      {discount > 0 && (
        <PriceRow label="Discount" value={`− ${formatTaka(discount)}`} />
      )}
      <PriceRow label="Total" value={formatTaka(grandTotal)} strong />
    </div>
  );
};

export default CartSummary;
