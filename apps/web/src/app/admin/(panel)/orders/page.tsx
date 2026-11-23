"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, formatDate, MODULES, ORDER_STATUSES, taka, titleCase } from "@/components/Admin/api";
import type { OrderSummary } from "@/components/Admin/types";
import { Button, Card, Empty, ErrorBox, Input, Loading, PageHeader, Pagination, Select, StatusBadge, Table, Td } from "@/components/Admin/ui";

type Filters = { module: string; status: string; storeId: string; q: string; page: number };

function OrdersList() {
  const { perms } = useAdmin();
  const router = useRouter();
  const params = useSearchParams();
  const filters: Filters = {
    module: params.get("module") || "",
    status: params.get("status") || "",
    storeId: params.get("storeId") || "",
    q: params.get("q") || "",
    page: Number(params.get("page")) || 1,
  };
  const [search, setSearch] = useState(filters.q);

  // Filters live in the URL so links (dashboard, store page) and Back work.
  const setFilters = (next: Partial<Filters>) => {
    const merged = { ...filters, page: 1, ...next };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "page" && v === 1)) qs.set(k, String(v));
    router.replace(`/admin/orders${qs.size ? `?${qs}` : ""}`);
  };

  const orders = useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: () => adminApi<OrderSummary[]>("/orders", { query: filters }),
    placeholderData: keepPreviousData,
  });
  const myStores = [...perms.stores.values()];

  return (
    <>
      <PageHeader title="Orders" subtitle={perms.seeAllStores ? "All stores" : "Orders for your store"} />
      <Card className="mb-4">
        <form
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({ q: search.trim() });
          }}
        >
          <Input
            className="lg:col-span-2"
            placeholder="Order code, customer name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} aria-label="Status">
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          {perms.seeAllStores ? (
            <Select value={filters.module} onChange={(e) => setFilters({ module: e.target.value })} aria-label="Module">
              <option value="">All modules</option>
              {MODULES.map((m) => (
                <option key={m} value={m}>
                  {titleCase(m)}
                </option>
              ))}
            </Select>
          ) : myStores.length > 1 ? (
            <Select value={filters.storeId} onChange={(e) => setFilters({ storeId: e.target.value })} aria-label="Store">
              <option value="">All my stores</option>
              {myStores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          ) : null}
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        {filters.storeId && perms.seeAllStores ? (
          <p className="mt-2 text-xs text-gray-500">
            Showing one store only.{" "}
            <button type="button" className="text-primary underline" onClick={() => setFilters({ storeId: "" })}>
              Show all stores
            </button>
          </p>
        ) : null}
      </Card>

      <Card>
        <ErrorBox error={orders.error} onRetry={() => orders.refetch()} />
        {orders.isPending ? (
          <Loading />
        ) : orders.data?.result.length ? (
          <>
            <Table head={["Order", "Placed", "Store", "Customer", "Total", "Status"]}>
              {orders.data.result.map((o) => (
                <tr key={o.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/orders/${o.id}`)}>
                  <Td>
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {o.code}
                    </Link>
                    <div className="text-xs text-gray-500">{titleCase(o.module)}</div>
                  </Td>
                  <Td className="whitespace-nowrap text-gray-600">{formatDate(o.createdAt)}</Td>
                  <Td>{o.storeName}</Td>
                  <Td>
                    {o.customerName || o.delivery?.name || "—"}
                    <div className="text-xs text-gray-500">{o.customerPhone}</div>
                  </Td>
                  <Td className="whitespace-nowrap font-medium">{taka(o.total)}</Td>
                  <Td>
                    <StatusBadge status={o.status} />
                  </Td>
                </tr>
              ))}
            </Table>
            <Pagination page={filters.page} total={orders.data.total} pageSize={orders.data.pageSize} onPage={(page) => setFilters({ page })} />
          </>
        ) : (
          <Empty>No orders match these filters.</Empty>
        )}
      </Card>
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersList />
    </Suspense>
  );
}
