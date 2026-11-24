"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, formatDate, packLabel, taka, titleCase } from "@/components/Admin/api";
import type { DeliveryInfo, OrderDetail, OrderStatus } from "@/components/Admin/types";
import { Button, Card, ConfirmButton, ErrorBox, Loading, Notice, PageHeader, StatusBadge, Table, Td, type ErrorLike } from "@/components/Admin/ui";
import RiderAssign from "@/components/Admin/RiderAssign";
import { admin } from "@notension/shared";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex justify-between gap-4 py-1 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right text-gray-900">{children}</span>
  </div>
);

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<ErrorLike>(null);
  const [notice, setNotice] = useState<ReactNode>(null);

  const order = useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => adminApi(`/orders/${id}`, { result: admin.orderDetail }).then((r) => r.result),
  });

  const move = async (status: OrderStatus) => {
    setBusy(status);
    setError(null);
    setNotice(null);
    try {
      const res = await adminApi(`/orders/${id}/status`, { method: "PATCH", body: { status } });
      setNotice(res.message);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      setError(err as Error);
    }
    setBusy(null);
  };

  if (order.isPending) return <Loading />;
  if (order.error) return <ErrorBox error={order.error} onRetry={() => order.refetch()} />;
  const o = order.data;

  const d: Partial<DeliveryInfo> = o.delivery || {};
  const canMove = perms.moveOrder(o.storeId) && o.nextStatuses.length > 0;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/orders", label: "Orders" }}
        title={`Order ${o.code}`}
        subtitle={`${titleCase(o.module)} · placed ${formatDate(o.createdAt)}`}
        actions={<StatusBadge status={o.status} />}
      />
      <ErrorBox error={error} />
      <Notice>{notice}</Notice>

      {canMove ? (
        <Card className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Move this order to</p>
          <div className="flex flex-wrap items-center gap-2">
            {o.nextStatuses
              .filter((s) => s !== "Cancelled")
              .map((s) => (
                <Button key={s} onClick={() => move(s)} loading={busy === s} disabled={!!busy}>
                  {s}
                </Button>
              ))}
            {o.nextStatuses.includes("Cancelled") ? (
              <ConfirmButton
                label="Cancel order"
                question="Cancel this order? This can't be undone."
                confirmLabel="Yes, cancel"
                loading={busy === "Cancelled"}
                onConfirm={() => move("Cancelled")}
              />
            ) : null}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold text-gray-900">Items</h2>
          <Table head={["Product", "Price", "Qty", "Amount"]}>
            {o.items.map((it) => (
              <tr key={it.id}>
                <Td>
                  {it.titleEn}
                  {it.packSize || it.unit ? (
                    <div className="text-xs text-gray-500">{packLabel(it)}</div>
                  ) : null}
                </Td>
                <Td className="whitespace-nowrap">
                  {taka(it.salePrice)}
                  {it.mrp > it.salePrice ? <div className="text-xs text-gray-400 line-through">{taka(it.mrp)}</div> : null}
                </Td>
                <Td>{it.quantity}</Td>
                <Td className="whitespace-nowrap font-medium">{taka(it.salePrice * it.quantity)}</Td>
              </tr>
            ))}
          </Table>
          <div className="mt-4 ml-auto max-w-xs border-t border-gray-200 pt-3">
            <Row label="Subtotal">{taka(o.subtotal)}</Row>
            {o.discount ? <Row label="Discount">−{taka(o.discount)}</Row> : null}
            {o.vat ? <Row label="VAT">{taka(o.vat)}</Row> : null}
            <Row label="Delivery">{taka(o.deliveryCharge)}</Row>
            <div className="mt-1 flex justify-between border-t border-gray-200 pt-2 font-semibold">
              <span>Total</span>
              <span>{taka(o.total)}</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <RiderAssign key={`${o.id}-${o.riderId || ""}`} order={o} />
          <Card>
            <h2 className="mb-2 font-semibold text-gray-900">Delivery</h2>
            <p className="text-sm font-medium text-gray-900">{d.name}</p>
            <p className="text-sm text-gray-700">{d.address}</p>
            <p className="mt-1 text-sm">
              {d.phone ? (
                <a className="text-primary hover:underline" href={`tel:${d.phone}`}>
                  {d.phone}
                </a>
              ) : null}
              {d.altPhone ? <span className="text-gray-500"> · {d.altPhone}</span> : null}
            </p>
            {d.latitude != null && d.longitude != null ? (
              <a
                className="mt-1 inline-block text-sm text-primary hover:underline"
                href={`https://www.google.com/maps?q=${d.latitude},${d.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            ) : null}
            {o.note ? <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-700">Note: {o.note}</p> : null}
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold text-gray-900">Customer</h2>
            <Row label="Name">{o.customerName || "—"}</Row>
            <Row label="Phone">{o.customerPhone}</Row>
            {o.customerCode ? <Row label="Customer ID">{o.customerCode}</Row> : null}
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold text-gray-900">Order</h2>
            <Row label="Store">
              <Link href={`/admin/stores/${o.storeId}`} className="text-primary hover:underline">
                {o.storeName}
              </Link>
            </Row>
            <Row label="Payment">{o.paymentMethod}</Row>
            <Row label="Last update">{formatDate(o.updatedAt)}</Row>
          </Card>
        </div>
      </div>
    </>
  );
}
