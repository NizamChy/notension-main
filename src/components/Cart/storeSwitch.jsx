"use client";

import React, { useSyncExternalStore } from "react";
import CommonModal from "../shared/CommonModal/CommonModal";
import { PrimaryButton } from "../shared/CartUI/CartUI";

// A cart holds items from one store. Adding an item from another store asks
// first (instead of silently emptying the cart): the item hooks call
// requestStoreSwitch() and <StoreSwitchModal /> (rendered by <Cart />) asks.

let pending = null;
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());

export const requestStoreSwitch = ({ fromStore, toStore, onConfirm }) => {
  pending = { fromStore, toStore, onConfirm };
  emit();
};

const close = () => {
  pending = null;
  emit();
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// URL of a store's page, built the same way as the store lists build it.
export const storePath = (moduleName, store) => {
  if (!store?._id || !store?.custom_store_id) return null;
  const slug = (store.shop_name || "store")
    .trim()
    .toLowerCase()
    .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
    .replace(/\s+/g, "-");
  const path = `${slug}/${store._id}/${store.custom_store_id}`;
  return moduleName === "food" ? `/food/store/${path}` : `/${moduleName}/${path}`;
};

export const StoreSwitchModal = () => {
  const request = useSyncExternalStore(
    subscribe,
    () => pending,
    () => null,
  );

  const confirm = () => {
    request?.onConfirm?.();
    close();
  };

  return (
    <CommonModal isOpen={!!request} onClose={close}>
      <h2 className="pr-6 text-lg font-bold text-gray-900">Start a new cart?</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        Your cart has items from{" "}
        <span className="font-semibold text-gray-900">
          {request?.fromStore || "another store"}
        </span>
        . A cart can only hold items from one store, so adding this item
        {request?.toStore ? ` from ${request.toStore}` : ""} will remove them.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
        <button
          type="button"
          onClick={close}
          className="h-12 w-full rounded-full border border-gray-200 px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Keep current cart
        </button>
        <PrimaryButton onClick={confirm}>Start new cart</PrimaryButton>
      </div>
    </CommonModal>
  );
};
