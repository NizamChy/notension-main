"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CommonModal, LoginModalDetails } from "./legacyViews";
import OrderDetailsModal from "./orders/OrderDetailsModal";
import { OrdersListView, type OrderView } from "./orders/OrderUI";
import { ORDER_MODULES, type OrderModuleName } from "./orders/orderModules";

type Props = { moduleName: OrderModuleName };
type StoreParams = { store?: string; storeId?: string; customStoreId?: string };

const StoreOrders = ({ moduleName }: Props) => {
  const { basePath, imageBase: imageBaseUrl, useOrders } = ORDER_MODULES[moduleName];

  const [selectedOrder, setSelectedOrder] = useState<OrderView | null>(null);
  const [loginDismissed, setLoginDismissed] = useState(false);

  const params = useParams<StoreParams>();
  // Loads once someone is signed in (also right after signing in through
  // the modal on this page).
  const result = useOrders();
  const { isLoading, isLoggedIn } = result;
  const orders: OrderView[] = result.orders;

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
