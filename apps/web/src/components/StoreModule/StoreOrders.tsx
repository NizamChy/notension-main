"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CommonModal, LoginModalDetails } from "./legacyViews";
import { useGroceryOrders } from "@/hooks/grocery/useGroceryOrders";
import { ITEM_MODULES } from "./moduleItems";
import OrderDetailsModal from "./orders/OrderDetailsModal";
import { OrdersListView, type OrderView } from "./orders/OrderUI";

type Props = { moduleName: "grocery" };
type StoreParams = { store?: string; storeId?: string; customStoreId?: string };

// Per-module order queries. Medicine joins in PR 3.
const ORDER_MODULES = { grocery: { useOrders: useGroceryOrders } } as const;

const StoreOrders = ({ moduleName }: Props) => {
  const { basePath, imageBaseUrl } = ITEM_MODULES[moduleName];
  const { useOrders } = ORDER_MODULES[moduleName];

  const [selectedOrder, setSelectedOrder] = useState<OrderView | null>(null);
  const [loginDismissed, setLoginDismissed] = useState(false);

  const params = useParams<StoreParams>();
  // Loads once someone is signed in (also right after signing in through
  // the modal on this page).
  const { orders, isLoading, isLoggedIn } = useOrders();

  const isModalOpen = !isLoggedIn && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);
  const storePath = `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

  return (
    <>
      {isLoggedIn && (
        <>
          <OrdersListView
            orders={orders}
            loading={isLoading}
            onView={setSelectedOrder}
            hrefFor={(order) => `${storePath}/orders/${order?._id}`}
          />

          {selectedOrder && (
            <OrderDetailsModal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              order={selectedOrder}
              imageBase={imageBaseUrl}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="private-route" />
        </CommonModal>
      )}
    </>
  );
};

export default StoreOrders;
