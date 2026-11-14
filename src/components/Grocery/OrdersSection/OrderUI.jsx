"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiCheck,
  HiChevronRight,
  HiOutlineXCircle,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineCreditCard,
  HiOutlineShoppingBag,
  HiOutlineCalendarDays,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import { lineTotal } from "@/utils/price";
import { formatTaka, PriceRow } from "@/components/shared/CartUI/CartUI";
import {
  CARD,
  PageHeader,
  Skeleton,
  EmptyState,
  StatusBadge,
  SECONDARY_BUTTON,
} from "@/components/shared/UI/UI";

// Presentation pieces shared by the grocery, medicine and food order pages
// (list, desktop modal and the mobile details page).

export const shortOrderId = (order) =>
  order?.order_id?.split("-").pop() || "—";

export const formatOrderDate = (date, long = false) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: long ? "long" : "short",
    day: "numeric",
  });
};

export const orderItemCount = (order) =>
  (order?.orderItems || []).reduce(
    (count, item) => count + (Number(item?.quantity) || 0),
    0
  );

const itemTitle = (item) =>
  item?.product_title_eng || item?.item_title_eng || item?.title || "Item";

// ---------------------------------------------------------------------------
// Orders list
// ---------------------------------------------------------------------------

export const OrderCard = ({ order, onView, href }) => {
  const count = orderItemCount(order);

  return (
    <article className={`${CARD} flex flex-col p-4 md:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Order
          </p>
          <p className="mt-0.5 truncate text-base font-bold tabular-nums text-gray-900 md:text-lg">
            #{shortOrderId(order)}
          </p>
        </div>
        <StatusBadge status={order?.order_status} />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C3F8E]/10 text-lg text-[#0C3F8E] dark:text-[#7FB2FF]">
          <HiOutlineBuildingStorefront />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {order?.merchantInfo?.shop_name || "Store"}
          </p>
          {order?.merchantInfo?.shop_address && (
            <p className="truncate text-xs text-gray-500">
              {order?.merchantInfo?.shop_address}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-gray-500">Date</dt>
          <dd className="mt-0.5 truncate font-medium text-gray-900">
            {formatOrderDate(order?.createdAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Items</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-gray-900">
            {count}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-xs text-gray-500">Total</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-gray-900">
            {formatTaka(order?.totalAmount)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        {/* Desktop opens the modal; mobile goes to the details page. */}
        <button
          type="button"
          onClick={onView}
          className={`${SECONDARY_BUTTON} hidden h-10 md:inline-flex`}
        >
          View details
          <HiChevronRight className="text-base" />
        </button>
        <Link
          href={href}
          className={`${SECONDARY_BUTTON} h-10 w-full md:hidden`}
        >
          View details
          <HiChevronRight className="text-base" />
        </Link>
      </div>
    </article>
  );
};

const OrderCardSkeleton = () => (
  <div className={`${CARD} space-y-4 p-4 md:p-5`}>
    <div className="flex justify-between">
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="ml-auto h-10 w-36 rounded-full" />
  </div>
);

export const OrdersListView = ({ orders, loading, onView, hrefFor }) => {
  const count = orders?.length || 0;

  return (
    <div className="w-full max-w-6xl">
      <PageHeader
        title="Order history"
        subtitle={
          !loading && count > 0
            ? `${count} ${count === 1 ? "order" : "orders"} from this store`
            : "Track and review the orders you have placed."
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : count > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
          {orders.map((order) => (
            <OrderCard
              key={order?._id}
              order={order}
              onView={() => onView(order)}
              href={hrefFor(order)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<HiOutlineShoppingBag />}
          title="No orders yet"
          text="When you place an order, it will show up here."
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Order details
// ---------------------------------------------------------------------------

const STEPS = ["Placed", "Confirmed", "On the way", "Delivered"];

const progressStep = (status = "") => {
  const s = String(status).toLowerCase();
  if (/(cancel|reject|fail|declin)/.test(s)) return -1;
  if (/(deliver|complete|done)/.test(s)) return 3;
  if (/(ship|way|picked|out for|dispatch)/.test(s)) return 2;
  if (/(confirm|accept|process|prepar|ready|paid)/.test(s)) return 1;
  return 0;
};

export const OrderProgress = ({ status }) => {
  const current = progressStep(status);

  if (current < 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-[#D92D20]/10 p-3 text-sm font-medium text-[#B42318] dark:text-[#F97066]">
        <HiOutlineXCircle className="shrink-0 text-xl" />
        This order was {String(status).toLowerCase()}.
      </div>
    );
  }

  return (
    <ol className="grid grid-cols-4" aria-label="Order progress">
      {STEPS.map((label, index) => {
        const done = index <= current;
        return (
          <li
            key={label}
            aria-current={index === current ? "step" : undefined}
            className="relative flex flex-col items-center text-center"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-3.5 h-0.5 w-full -translate-y-1/2 ${
                  done ? "bg-[#12B76A]" : "bg-gray-200"
                }`}
              />
            )}
            <span
              className={`relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                done
                  ? "border-[#12B76A] bg-[#12B76A] text-white"
                  : "border-gray-200 bg-white text-gray-400"
              }`}
            >
              {done ? <HiCheck className="text-sm" /> : index + 1}
            </span>
            <span
              className={`mt-1.5 text-[11px] leading-tight sm:text-xs ${
                done ? "font-semibold text-gray-900" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const DetailBlock = ({ icon, title, children }) => (
  <div className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0C3F8E]/10 text-base text-[#0C3F8E] dark:text-[#7FB2FF]">
      {icon}
    </span>
    <div className="min-w-0 text-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>
      <div className="mt-0.5 break-words text-gray-900">{children}</div>
    </div>
  </div>
);

const SectionHeading = ({ children, meta }) => (
  <div className="mb-3 flex items-baseline justify-between gap-3">
    <h3 className="text-sm font-semibold text-gray-900">{children}</h3>
    {meta && <span className="text-xs text-gray-500">{meta}</span>}
  </div>
);

// Everything about one order. `imageBase` is the module's item image URL.
export const OrderDetails = ({ order, imageBase }) => {
  const merchant = order?.merchantInfo || {};
  const phones = [merchant.contact_no, merchant.alternative_contact_no]
    .filter(Boolean)
    .join(", ");
  const deliveryAddress = order?.customerInfo?.customer_address;
  const items = order?.orderItems || [];
  const discount = Number(order?.less_amount) || 0;
  const vat = Number(order?.vatAmount) || 0;
  const count = orderItemCount(order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Order details
          </p>
          <h2 className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-gray-900 md:text-2xl">
            #{shortOrderId(order)}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <HiOutlineCalendarDays className="shrink-0" />
            Placed on {formatOrderDate(order?.createdAt, true)}
          </p>
        </div>
        <StatusBadge status={order?.order_status} />
      </div>

      <OrderProgress status={order?.order_status} />

      {/* Store, delivery and payment */}
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailBlock icon={<HiOutlineBuildingStorefront />} title="Store">
          <p className="font-semibold">{merchant.shop_name || "—"}</p>
          {merchant.shop_address && (
            <p className="mt-0.5 text-gray-500">{merchant.shop_address}</p>
          )}
          {phones && (
            <p className="mt-1 flex items-center gap-1 text-gray-500">
              <HiOutlinePhone className="shrink-0" />
              <span className="tabular-nums">{phones}</span>
            </p>
          )}
        </DetailBlock>

        <div className="grid gap-3">
          {deliveryAddress && (
            <DetailBlock icon={<HiOutlineMapPin />} title="Delivery address">
              {deliveryAddress}
            </DetailBlock>
          )}
          <DetailBlock icon={<HiOutlineCreditCard />} title="Payment method">
            <span className="font-medium">{order?.paymet_method || "—"}</span>
          </DetailBlock>
        </div>
      </div>

      {/* Items */}
      <section>
        <SectionHeading meta={`${count} ${count === 1 ? "item" : "items"}`}>
          Ordered items
        </SectionHeading>
        {items.length > 0 ? (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 px-3">
            {items.map((item, index) => (
              <li
                key={item?._id || index}
                className="flex items-center gap-3 py-3"
              >
                <span className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  <Image
                    src={
                      item?.app_image
                        ? `${imageBase}/${item?.app_image}`
                        : "/png/dummyImage.png"
                    }
                    alt={itemTitle(item)}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
                    {itemTitle(item)}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-gray-500">
                    {item?.quantity} × {formatTaka(item?.sale_price)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                  {formatTaka(lineTotal(item))}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
            No item list for this order.
          </p>
        )}
      </section>

      {/* Price breakdown */}
      <section className="space-y-2 rounded-xl bg-gray-50 p-4">
        <PriceRow label="Subtotal" value={formatTaka(order?.subTotal)} />
        <PriceRow
          label="Delivery charge"
          value={formatTaka(order?.deliveryCharge)}
        />
        {vat > 0 && <PriceRow label="VAT" value={formatTaka(vat)} />}
        <PriceRow
          label="Discount"
          value={discount > 0 ? `-${formatTaka(discount)}` : formatTaka(0)}
        />
        <PriceRow
          strong
          label="Total"
          value={formatTaka(order?.totalAmount)}
        />
      </section>
    </div>
  );
};

export const OrderDetailsSkeleton = () => (
  <div className={`${CARD} mx-auto max-w-3xl space-y-5 p-5 md:p-6`}>
    <Skeleton className="h-14 w-48" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
);

// Mobile / direct-link page frame around OrderDetails.
export const OrderDetailsPage = ({ order, imageBase, backHref, notFound }) => (
  <div className="mx-auto w-full max-w-3xl">
    {backHref && (
      <Link
        href={backHref}
        className="mb-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <HiChevronRight className="rotate-180 text-base" />
        Order history
      </Link>
    )}
    {notFound ? (
      <EmptyState
        icon={<HiOutlineShoppingBag />}
        title="Order not found"
        text="We couldn't find this order. It may belong to another account."
      />
    ) : (
      <div className={`${CARD} p-4 md:p-6`}>
        <OrderDetails order={order} imageBase={imageBase} />
      </div>
    )}
  </div>
);
