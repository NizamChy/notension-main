"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
  fashionCount,
  fashionTotal,
  useCartStore,
} from "@/stores/cartStore";

const CartContext = createContext();

// The bag lives in the shared cart store; this keeps the Fashion `useCart()`
// API the fashion components already use.
export const CartProvider = ({ children }) => {
  const cartItems = useCartStore((state) => state.fashion);

  const value = useMemo(() => {
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
      isInitialized: useCartStore.persist.hasHydrated(),
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be within a CartProvider");
  }

  return context;
};
