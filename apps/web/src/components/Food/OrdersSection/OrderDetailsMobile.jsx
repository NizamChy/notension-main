"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import {
  OrderDetailsPage,
  OrderDetailsSkeleton,
} from "@/components/StoreModule/orders/OrderUI";

const OrderDetailsMobile = ({ orderId }) => {
  const [loginDismissed, setLoginDismissed] = useState(false);
  const [requested, setRequested] = useState(false);

  const params = useParams();
  const { progressing, getOrderInfo } = useOrderFood();
  const userInfo = useSessionStore((s) => s.userInfo);
  const foodOrderInfo = useSelector((state) => state.user.foodOrderInfo);

  const order = foodOrderInfo?.find((order) => order?._id === orderId);
  const backHref = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/orders`;

  // Logged-out visitors get the login modal until they sign in or close it.
  const isModalOpen = !userInfo?._id && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  // The order list is in Redux when the user came from Order History. A
  // direct link (or a reload with cleared state) fetches it again.
  useEffect(() => {
    if (userInfo?._id && !order) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- marks the fetch as started
      setRequested(true);
      getOrderInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only for another order / account
  }, [orderId, userInfo?._id]);

  if (userInfo?._id && !order && (progressing || !requested)) {
    return <OrderDetailsSkeleton />;
  }

  return (
    <>
      {userInfo?._id && (
        <OrderDetailsPage
          order={order}
          notFound={!order}
          backHref={backHref}
          imageBase={FOOD_ITEMS_IMAGES}
        />
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

export default OrderDetailsMobile;
