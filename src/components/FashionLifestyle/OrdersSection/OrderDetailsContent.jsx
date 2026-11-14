import React from "react";
import Image from "next/image";
import { lineTotal } from "@/utils/price";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { StatusBadge } from "@/components/shared/UI/UI";
import { PriceRow, formatTaka } from "@/components/shared/CartUI/CartUI";
import {
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";

export const orderNumber = (order) => order?.order_id?.split("-").pop();

export const orderDate = (order) =>
  order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

export const shopPhones = (merchant) =>
  [merchant?.contact_no, merchant?.alternative_contact_no]
    .filter(Boolean)
    .join(", ");

const SectionHeading = ({ children }) => (
  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
    {children}
  </h3>
);

/** Full order breakdown, shared by the desktop modal and the mobile page. */
const OrderDetailsContent = ({ order }) => {
  const merchant = order?.merchantInfo;
  const discount = Number(order?.less_amount) || 0;

  return (
    <div className="space-y-6 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-gray-900">
            Order #{orderNumber(order)}
          </p>
          <p className="mt-0.5 text-gray-500">Placed on {orderDate(order)}</p>
        </div>
        <StatusBadge status={order?.order_status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <SectionHeading>Shop</SectionHeading>
          <p className="flex items-start gap-2 font-semibold text-gray-900">
            <HiOutlineBuildingStorefront className="mt-0.5 shrink-0 text-gray-500" />
            {merchant?.shop_name}
          </p>
          {merchant?.shop_address && (
            <p className="mt-1.5 flex items-start gap-2 text-gray-600">
              <HiOutlineMapPin className="mt-0.5 shrink-0 text-gray-500" />
              {merchant.shop_address}
            </p>
          )}
          {shopPhones(merchant) && (
            <p className="mt-1.5 flex items-start gap-2 tabular-nums text-gray-600">
              <HiOutlinePhone className="mt-0.5 shrink-0 text-gray-500" />
              {shopPhones(merchant)}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <SectionHeading>Payment</SectionHeading>
          <p className="font-semibold capitalize text-gray-900">
            {String(order?.paymet_method || "—").replace(/[_-]/g, " ")}
          </p>
          <p className="mt-1.5 text-gray-600">
            Total{" "}
            <span className="font-semibold tabular-nums text-gray-900">
              {formatTaka(order?.totalAmount)}
            </span>
          </p>
        </div>
      </div>

      <div>
        <SectionHeading>
          Items ({order?.orderItems?.length || 0})
        </SectionHeading>
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {order?.orderItems?.map((item) => (
            <li key={item?._id} className="flex items-center gap-3 p-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={
                    item?.app_image
                      ? `${FASHION_IMAGE_URL}/${item?.app_image}`
                      : "/png/dummyImage.png"
                  }
                  alt={item?.product_title_eng || "Product"}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium text-gray-900">
                  {item?.product_title_eng}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-gray-500">
                  {formatTaka(item?.sale_price)} × {item?.quantity}
                  {item?.selectedSize ? ` · Size ${item.selectedSize}` : ""}
                </p>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                {formatTaka(lineTotal(item))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <PriceRow label="Subtotal" value={formatTaka(order?.subTotal)} />
        <PriceRow
          label="Delivery charge"
          value={formatTaka(order?.deliveryCharge)}
        />
        {discount > 0 && (
          <PriceRow label="Discount" value={`-${formatTaka(discount)}`} />
        )}
        <PriceRow label="Total" value={formatTaka(order?.totalAmount)} strong />
      </div>
    </div>
  );
};

export default OrderDetailsContent;
