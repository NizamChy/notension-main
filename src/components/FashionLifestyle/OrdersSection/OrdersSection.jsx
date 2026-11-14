"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import { HiChevronRight } from "react-icons/hi";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import { FASHION_CONTAINER } from "../shared/FashionSection";
import { orderDate, orderNumber } from "./OrderDetailsContent";
import { useProductOrder } from "../hooks/fetchData/useProductOrder";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import {
  HiOutlineBuildingStorefront,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import {
  CARD,
  CARD_HOVER,
  EmptyState,
  PageHeader,
  PRIMARY_BUTTON,
  Skeleton,
  StatusBadge,
} from "@/components/shared/UI/UI";

const OrdersSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const router = useRouter();

  const { userInfo } = useSelector((state) => state.user);
  const { useAllOrderByCustomer } = useProductOrder();
  const { data: orderInfo, isLoading } = useAllOrderByCustomer(
    userInfo?._id,
    userInfo?.custom_id
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desktop opens a modal; mobile goes to the order page.
  const viewOrder = (order) => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setSelectedOrder(order);
    } else {
      router.push(`/fashion-lifestyle/orders/${order?._id}`);
    }
  };

  return (
    <>
      {userInfo?._id && (
        <div className="min-h-content bg-gray-50">
          <div className={`${FASHION_CONTAINER} py-6 md:py-10`}>
            <PageHeader
              title="My orders"
              subtitle={
                orderInfo?.length
                  ? `${orderInfo.length} ${
                      orderInfo.length === 1 ? "order" : "orders"
                    }`
                  : "Track and review your fashion orders"
              }
            />

            {isLoading ? (
              <div className="grid gap-4 lg:grid-cols-2" aria-hidden>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`${CARD} space-y-3 p-5`}>
                    <Skeleton className="h-5 w-1/3 !rounded-full" />
                    <Skeleton className="h-4 w-2/3 !rounded-full" />
                    <Skeleton className="h-4 w-1/2 !rounded-full" />
                  </div>
                ))}
              </div>
            ) : orderInfo && orderInfo?.length > 0 ? (
              <ul className="grid gap-4 lg:grid-cols-2">
                {orderInfo?.map((order) => (
                  <li key={order?._id}>
                    <button
                      type="button"
                      onClick={() => viewOrder(order)}
                      className={`${CARD} ${CARD_HOVER} flex h-full w-full flex-col p-4 text-left sm:p-5`}
                    >
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            Order #{orderNumber(order)}
                          </p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {orderDate(order)}
                          </p>
                        </div>
                        <StatusBadge status={order?.order_status} />
                      </div>

                      <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                        <HiOutlineBuildingStorefront className="shrink-0 text-gray-500" />
                        <span className="truncate">
                          {order?.merchantInfo?.shop_name}
                        </span>
                      </p>

                      <div className="mt-4 flex w-full items-end justify-between gap-3 border-t border-dashed border-gray-200 pt-3">
                        <div>
                          <p className="text-xs text-gray-500">
                            {order?.orderItems?.length || 0}{" "}
                            {order?.orderItems?.length === 1 ? "item" : "items"}{" "}
                            · Total
                          </p>
                          <p className="text-base font-bold tabular-nums text-gray-900">
                            {formatTaka(order?.totalAmount)}
                          </p>
                        </div>
                        <span className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
                          View details
                          <HiChevronRight />
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<HiOutlineShoppingBag />}
                title="No orders yet"
                text="When you place an order, it will show up here."
                action={
                  <Link href="/fashion-lifestyle" className={PRIMARY_BUTTON}>
                    Start shopping
                  </Link>
                }
              />
            )}

            {selectedOrder && (
              <OrderDetailsModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
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

export default OrdersSection;
