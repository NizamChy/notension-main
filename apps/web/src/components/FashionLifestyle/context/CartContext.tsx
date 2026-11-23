"use client";

import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  fashionCount,
  fashionTotal,
  useCartStore,
  type CartItemInput,
  type FashionLine,
} from "@/stores/cartStore";

/** What `useCart()` gives the fashion components. */
export type CartContextValue = {
  cartItems: FashionLine[];
  addToCart: (
    product: CartItemInput,
    quantity?: number,
    selectedSize?: string | null,
    selectedImage?: string | null,
    selectedColor?: string | null,
  ) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number,
    selectedSize: string | null,
    selectedImage: string | null,
  ) => void;
  removeFromCart: (
    productId: string,
    selectedSize: string | null,
    selectedImage: string | null,
  ) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInitialized: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type Props = { children: ReactNode };

// The bag lives in the shared cart store; this keeps the Fashion `useCart()`
// API the fashion components already use.
export const CartProvider = ({ children }: Props) => {
  const cartItems = useCartStore((state) => state.fashion);

  const value = useMemo((): CartContextValue => {
    const store = () => useCartStore.getState();
    return {
      cartItems,
      addToCart: (
        product,
        quantity = 1,
        selectedSize = null,
        selectedImage = null,
        selectedColor = null,
      ) =>
        store().fashionAdd(
          product,
          quantity,
          selectedSize,
          selectedImage,
          selectedColor,
        ),
      updateQuantity: (productId, newQuantity, selectedSize, selectedImage) =>
        store().fashionUpdateQuantity(
          productId,
          newQuantity,
          selectedSize,
          selectedImage,
        ),
      removeFromCart: (productId, selectedSize, selectedImage) =>
        store().fashionRemove(productId, selectedSize, selectedImage),
      clearCart: () => store().fashionClear(),
      getCartTotal: () => fashionTotal(cartItems),
      getCartCount: () => fashionCount(cartItems),
      // Reads hasHydrated() without subscribing; safe because the PersistGate
      // awaits hydrateStores() before any child renders.
      isInitialized: useCartStore.persist.hasHydrated(),
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be within a CartProvider");
  }

  return context;
};
