"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CommonModal, LoginModalDetails } from "./legacyViews";
import { OrderDetailsPage, OrderDetailsSkeleton } from "./orders/OrderUI";
import { ORDER_MODULES, type OrderModuleName } from "./orders/orderModules";

type Props = { moduleName: OrderModuleName; orderId: string | null };
type StoreParams = { store?: string; storeId?: string; customStoreId?: string };

// The mobile / direct-link page for one order. The order comes from the
// cached order list; a direct link or reload fetches the list.
const StoreOrderDetails = ({ moduleName, orderId }: Props) => {
  const { basePath, imageBase: imageBaseUrl, useOrders } = ORDER_MODULES[moduleName];
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
