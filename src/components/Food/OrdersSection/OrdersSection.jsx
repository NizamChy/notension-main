"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import { useParams } from "next/navigation";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
import { OrdersListView } from "@/components/Grocery/OrdersSection/OrderUI";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const OrdersSection = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();

  const { progressing, getOrderInfo } = useOrderFood();
  const { userInfo } = useSelector((state) => state.user);
  const foodOrderInfo = useSelector((state) => state.user.foodOrderInfo);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    getOrderInfo();
  }, []);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
  }, []);

  return (
    <>
      {userInfo?._id && (
        <>
          <OrdersListView
            orders={foodOrderInfo}
            loading={progressing}
            onView={setSelectedOrder}
            hrefFor={(order) =>
              `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/orders/${order?._id}`
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
