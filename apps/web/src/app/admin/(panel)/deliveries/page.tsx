"use client";

// Rider panel: the orders assigned to me. Built for a phone: one card per
// order with call / map buttons and one big action.
import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import { adminApi, formatDate, packLabel, taka } from "@/components/Admin/api";
import type { DeliveryInfo, OrderStatus, RiderOrder } from "@/components/Admin/types";
import { Button, Card, cx, Empty, ErrorBox, Loading, PageHeader, Pagination, StatusBadge } from "@/components/Admin/ui";
import { notify } from "@/utils/notify";

const mapUrl = (lat: number | null | undefined, lng: number | null | undefined, address: string | undefined) =>
  lat != null && lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null;

type ContactProps = {
  title: string;
  name?: string;
  address?: string;
  phone?: string | null;
  altPhone?: string | null;
  map: string | null;
};

function Contact({ title, name, address, phone, altPhone, map }: ContactProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-0.5 font-medium text-gray-900">{name || "—"}</p>
      {address ? <p className="text-sm text-gray-700">{address}</p> : null}
      {altPhone ? <p className="text-xs text-gray-500">Other number: {altPhone}</p> : null}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-800"
          >
            <HiOutlinePhone className="text-base" /> Call
          </a>
        ) : (
          <span />
        )}
        {map ? (
          <a
            href={map}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-800"
          >
            <HiOutlineMapPin className="text-base" /> Map
          </a>
        ) : null}
      </div>
    </div>
  );
}

const ACTION: Partial<Record<OrderStatus, { label: string; confirm: string | null }>> = {
  "On the way": { label: "Picked up — start delivery", confirm: null },
  Delivered: { label: "Mark delivered", confirm: "Handed over to the customer?" },
};

function DeliveryCard({ o, onChanged }: { o: RiderOrder; onChanged: () => Promise<unknown> }) {
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState(false);
  const d: Partial<DeliveryInfo> = o.delivery || {};
  const s: Partial<RiderOrder["store"]> = o.store || {};
  const action = o.nextStatus ? ACTION[o.nextStatus] : null;
  const itemCount = o.items.reduce((n, it) => n + it.quantity, 0);

  const move = async () => {
    setBusy(true);
    setAsking(false);
    try {
      const res = await adminApi(`/rider/orders/${o.id}/status`, { method: "PATCH", body: { status: o.nextStatus } });
      notify.success(res.message ?? "Done");
      await onChanged();
    } catch (err) {
      notify.error((err as Error).message);
    }
    setBusy(false);
  };

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{o.code}</p>
          <p className="text-xs text-gray-500">Placed {formatDate(o.createdAt)}</p>
        </div>
        <StatusBadge status={o.status} />
      </div>

      {o.cashToCollect > 0 && !["Delivered", "Cancelled"].includes(o.status) ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
          <span className="text-sm">Collect cash</span> <span className="text-lg font-bold">{taka(o.cashToCollect)}</span>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-600">
          {o.paymentMethod} · <span className="font-semibold text-gray-900">{taka(o.total)}</span>
        </p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Contact
          title="Pick up from"
          name={s.name}
          address={s.address}
          phone={s.phone}
          altPhone={s.altPhone}
          map={mapUrl(s.latitude, s.longitude, s.address)}
        />
        <Contact
          title="Deliver to"
          name={d.name}
          address={d.address}
          phone={d.phone}
          altPhone={d.altPhone}
          map={mapUrl(d.latitude, d.longitude, d.address)}
        />
      </div>
      {o.note ? <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-sm text-gray-800">Note: {o.note}</p> : null}

      <details className="mt-3 rounded-lg border border-gray-200">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-800">
          {itemCount} item{itemCount === 1 ? "" : "s"} · total {taka(o.total)}
        </summary>
        <ul className="divide-y divide-gray-100 px-3 pb-2 text-sm">
          {o.items.map((it, i) => (
            <li key={i} className="flex justify-between gap-3 py-1.5">
              <span className="min-w-0">
                {it.titleEn}
                {it.packSize || it.unit ? <span className="text-xs text-gray-500"> · {packLabel(it)}</span> : null}
              </span>
              <span className="whitespace-nowrap text-gray-700">× {it.quantity}</span>
            </li>
          ))}
        </ul>
      </details>

      {action ? (
        asking ? (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="mb-2 text-sm text-green-900">{action.confirm}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button className="min-h-12" onClick={move} loading={busy}>
                Yes, delivered
              </Button>
              <Button variant="secondary" className="min-h-12" onClick={() => setAsking(false)}>
                Not yet
              </Button>
            </div>
          </div>
        ) : (
          <Button className="mt-3 min-h-12 w-full" loading={busy} onClick={() => (action.confirm ? setAsking(true) : move())}>
            {action.label}
          </Button>
        )
      ) : ["Pending", "Accepted"].includes(o.status) ? (
        <p className="mt-3 text-center text-sm text-gray-500">The store is still preparing this order.</p>
      ) : null}
    </Card>
  );
}

export default function DeliveriesPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState("active");
  const [page, setPage] = useState(1);
  const list = useQuery({
    queryKey: ["admin", "rider-orders", view, page],
    queryFn: () => adminApi<RiderOrder[]>("/rider/orders", { query: { view, page } }),
    placeholderData: keepPreviousData,
    refetchInterval: view === "active" ? 60_000 : false,
  });
  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", "rider-orders"] });

  return (
    <>
      <PageHeader title="Deliveries" subtitle="Orders assigned to you." />
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1" role="tablist">
        {[
          ["active", "My deliveries"],
          ["done", "Completed"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            onClick={() => {
              setView(key);
              setPage(1);
            }}
            className={cx(
              "rounded-md py-2 text-sm font-medium",
              view === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ErrorBox error={list.error} onRetry={() => list.refetch()} />
      {list.isPending ? (
        <Loading />
      ) : list.data?.result.length ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {list.data.result.map((o) => (
              <DeliveryCard key={o.id} o={o} onChanged={reload} />
            ))}
          </div>
          <Pagination page={page} total={list.data.total} pageSize={list.data.pageSize} onPage={setPage} />
        </>
      ) : (
        <Card>
          <Empty>{view === "active" ? "No deliveries right now. New ones show up here when a store assigns you." : "No completed deliveries yet."}</Empty>
        </Card>
      )}
    </>
  );
}
