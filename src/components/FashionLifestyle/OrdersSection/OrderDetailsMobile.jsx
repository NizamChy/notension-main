"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import OrderDetailsContent from "./OrderDetailsContent";
import { FASHION_CONTAINER } from "../shared/FashionSection";
import { useProductOrder } from "../hooks/fetchData/useProductOrder";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import {
  CARD,
  EmptyState,
  PageHeader,
  Skeleton,
} from "@/components/shared/UI/UI";

const OrderDetailsMobile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const orderId = params?.orderId;

  const { userInfo } = useSelector((state) => state.user);
  const { useAllOrderByCustomer } = useProductOrder();
  const { data: orderInfo, isLoading } = useAllOrderByCustomer(
    userInfo?._id,
    userInfo?.custom_id
  );

  const order = orderInfo && orderInfo?.find((order) => order?._id === orderId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <>
      {userInfo?._id && (
        <div className="min-h-content bg-gray-50">
          <div className={`${FASHION_CONTAINER} !max-w-3xl py-6 md:py-10`}>
            <PageHeader
              title="Order details"
              back="/fashion-lifestyle/orders"
              backLabel="My orders"
            />

            {isLoading ? (
              <div className={`${CARD} space-y-4 p-5`} aria-hidden>
                <Skeleton className="h-6 w-1/3 !rounded-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : order ? (
              <div className={`${CARD} p-4 sm:p-6`}>
                <OrderDetailsContent order={order} />
              </div>
            ) : (
              <EmptyState
                icon={<HiOutlineShoppingBag />}
                title="Order not found"
                text="We couldn't find this order in your history."
              />
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="private-route" />
        </CommonModal>
      )}
    </>
  );
};

export default OrderDetailsMobile;
