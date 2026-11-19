"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OrderDetailsPage, OrderDetailsSkeleton } from "./OrderUI";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { useOrderGrocery } from "@/hooks/place-order/useOrderGrocery";

const OrderDetailsMobile = ({ orderId }) => {
  const [loginDismissed, setLoginDismissed] = useState(false);
  const [requested, setRequested] = useState(false);

  const params = useParams();
  const { progressing, getOrderInfo } = useOrderGrocery();
  const { userInfo } = useSelector((state) => state.user);
  const groceryOrderInfo = useSelector((state) => state.user.groceryOrderInfo);

  const order = groceryOrderInfo?.find((order) => order?._id === orderId);
  const backHref = `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}/orders`;

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
          imageBase={GROCERY_ITEMS_IMAGES}
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
