"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { OrdersListView } from "./OrderUI";
import OrderDetailsModal from "./OrderDetailsModal";
import { useParams } from "next/navigation";
import { useOrderGrocery } from "@/hooks/place-order/useOrderGrocery";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const OrdersSection = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loginDismissed, setLoginDismissed] = useState(false);

  const params = useParams();

  const { progressing, getOrderInfo } = useOrderGrocery();
  const userInfo = useSessionStore((s) => s.userInfo);
  const groceryOrderInfo = useSelector((state) => state.user.groceryOrderInfo);

  const isModalOpen = !userInfo?._id && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  // Load the account's orders once someone is signed in (also right after
  // signing in through the modal on this page).
  useEffect(() => {
    if (userInfo?._id) getOrderInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getOrderInfo is recreated every render
  }, [userInfo?._id]);

  return (
    <>
      {userInfo?._id && (
        <>
          <OrdersListView
            orders={groceryOrderInfo}
            loading={progressing}
            onView={setSelectedOrder}
            hrefFor={(order) =>
              `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}/orders/${order?._id}`
            }
          />

          {selectedOrder && (
            <OrderDetailsModal
              isOpen={!!selectedOrder}
              onClose={() => setSelectedOrder(null)}
              order={selectedOrder}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <>
          <CommonModal isOpen={isModalOpen} onClose={closeModal}>
            <LoginModalDetails onClose={closeModal} type="private-route" />
          </CommonModal>
        </>
      )}
    </>
  );
};

export default OrdersSection;
