"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import { useParams } from "next/navigation";
import { OrdersListView } from "@/components/Grocery/OrdersSection/OrderUI";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";

const OrdersSection = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loginDismissed, setLoginDismissed] = useState(false);

  const params = useParams();

  const userInfo = useSessionStore((s) => s.userInfo);
  const { progressing, getOrderInfo } = useOrderMedicine();
  const medicineOrderInfo = useSelector(
    (state) => state.user.medicineOrderInfo
  );

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
            orders={medicineOrderInfo}
            loading={progressing}
            onView={setSelectedOrder}
            hrefFor={(order) =>
              `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/orders/${order?._id}`
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
