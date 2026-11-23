"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CommonModal, LoginModalDetails } from "./legacyViews";
import { useGroceryOrders } from "@/hooks/grocery/useGroceryOrders";
import { ITEM_MODULES } from "./moduleItems";
import { OrderDetailsPage, OrderDetailsSkeleton } from "./orders/OrderUI";

type Props = { moduleName: "grocery"; orderId: string | null };
type StoreParams = { store?: string; storeId?: string; customStoreId?: string };

// Per-module order queries. Medicine joins in PR 3.
const ORDER_MODULES = { grocery: { useOrders: useGroceryOrders } } as const;

// The mobile / direct-link page for one order. The order comes from the
// cached order list; a direct link or reload fetches the list.
const StoreOrderDetails = ({ moduleName, orderId }: Props) => {
  const { basePath, imageBaseUrl } = ITEM_MODULES[moduleName];
  const { useOrders } = ORDER_MODULES[moduleName];
  const [loginDismissed, setLoginDismissed] = useState(false);

  const params = useParams<StoreParams>();
  const { orders, isLoading, isLoggedIn } = useOrders();

  const order = orders.find((o) => o?._id === orderId);
  const backHref = `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}/orders`;

  // Logged-out visitors get the login modal until they sign in or close it.
  const isModalOpen = !isLoggedIn && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  if (isLoggedIn && !order && isLoading) {
    return <OrderDetailsSkeleton />;
  }

  return (
    <>
      {isLoggedIn && (
        <OrderDetailsPage
          order={order}
          notFound={!order}
          backHref={backHref}
          imageBase={imageBaseUrl}
        />
      )}

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="private-route" />
        </CommonModal>
      )}
    </>
  );
};

export default StoreOrderDetails;
