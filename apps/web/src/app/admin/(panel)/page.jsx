"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, ORDER_STATUSES, taka, titleCase } from "@/components/Admin/api";
import { Card, ErrorBox, Loading, PageHeader, StatusBadge } from "@/components/Admin/ui";

const Tile = ({ label, value, sub, href }) => {
  const body = (
    <Card className="h-full">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub ? <p className="mt-0.5 text-sm text-gray-500">{sub}</p> : null}
    </Card>
  );
  return href ? (
    <Link href={href} className="block hover:opacity-90">
      {body}
    </Link>
  ) : (
    body
  );
};

function Bars({ rows, label, href }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <Link href={href(r)} className="-my-1.5 py-1.5 hover:underline md:my-0 md:py-0">
              {label(r)}
            </Link>
            <span className="text-gray-600">
              {r.n} · {taka(r.total)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${(r.n / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AdminDashboard() {
  const { me, perms } = useAdmin();
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: () => adminApi("/stats").then((r) => r.result) });

  const s = stats.data;
  const byStatus = ORDER_STATUSES.map((status) => {
    const row = s?.ordersByStatus.find((r) => r.status === status);
    return { key: status, status, n: row?.n ?? 0, total: row?.total ?? 0 };
  });
  const open = byStatus.filter((r) => !["Delivered", "Cancelled"].includes(r.status)).reduce((a, r) => a + r.n, 0);

  return (
    <>
      <PageHeader title={`Hello${me.name ? `, ${me.name}` : ""}`} subtitle="Here's how things stand right now." />
      <ErrorBox error={stats.error} onRetry={() => stats.refetch()} />
      {stats.isPending ? (
        <Loading />
      ) : s ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Tile label="Orders, last 24h" value={s.last24h.orders} sub={taka(s.last24h.revenue)} />
            <Tile label="Open orders" value={open} sub="Not delivered or cancelled" href={perms.seeOrders ? "/admin/orders" : undefined} />
            <Tile label={perms.seeAllStores ? "Stores" : "Your stores"} value={s.stores} href={perms.seeStores ? "/admin/stores" : undefined} />
            {s.users !== undefined ? <Tile label="Users" value={s.users} href={perms.seeUsers ? "/admin/users" : undefined} /> : null}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <h2 className="mb-4 font-semibold text-gray-900">Orders by status</h2>
              <Bars
                rows={byStatus}
                label={(r) => <StatusBadge status={r.status} />}
                href={(r) => `/admin/orders?status=${encodeURIComponent(r.status)}`}
              />
            </Card>
            <Card>
              <h2 className="mb-1 font-semibold text-gray-900">Orders by module</h2>
              <p className="mb-4 text-xs text-gray-500">All time, without cancelled orders.</p>
              {s.ordersByModule.length ? (
                <Bars
                  rows={s.ordersByModule.map((r) => ({ ...r, key: r.module }))}
                  label={(r) => titleCase(r.module)}
                  href={(r) => `/admin/orders?module=${r.module}`}
                />
              ) : (
                <p className="text-sm text-gray-500">No orders yet.</p>
              )}
            </Card>
          </div>
        </>
      ) : null}
    </>
  );
}
