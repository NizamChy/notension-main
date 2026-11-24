"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, MODULES, titleCase } from "@/components/Admin/api";
import type { Store } from "@/components/Admin/types";
import { Badge, Button, ButtonLink, Card, Empty, ErrorBox, Input, Loading, PageHeader, Pagination, Select, Table, Td } from "@/components/Admin/ui";
import { admin } from "@notension/shared";

export default function StoresPage() {
  const { perms } = useAdmin();
  const router = useRouter();
  const [filters, setFilters] = useState({ module: "", q: "", page: 1 });
  const [search, setSearch] = useState("");

  const stores = useQuery({
    queryKey: ["admin", "stores", filters],
    queryFn: () => adminApi("/stores", { query: filters, result: admin.store.array() }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <PageHeader
        title={perms.seeAllStores ? "Stores" : "My stores"}
        actions={perms.canCreateStore ? <ButtonLink href="/admin/stores/new">Add store</ButtonLink> : null}
      />
      {perms.seeAllStores ? (
        <Card className="mb-4">
          <form
            className="grid gap-2 sm:grid-cols-[1fr_200px_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              setFilters({ ...filters, q: search.trim(), page: 1 });
            }}
          >
            <Input placeholder="Store name or code" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={filters.module} onChange={(e) => setFilters({ ...filters, module: e.target.value, page: 1 })} aria-label="Module">
              <option value="">All modules</option>
              {MODULES.map((m) => (
                <option key={m} value={m}>
                  {titleCase(m)}
                </option>
              ))}
            </Select>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </Card>
      ) : null}

      <Card>
        <ErrorBox error={stores.error} onRetry={() => stores.refetch()} />
        {stores.isPending ? (
          <Loading />
        ) : stores.data?.result.length ? (
          <>
            <Table head={["Store", "Module", "Area", "Status"]}>
              {stores.data.result.map((s) => (
                <tr key={s.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/stores/${s.id}`)}>
                  <Td>
                    <Link href={`/admin/stores/${s.id}`} className="font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {s.name}
                    </Link>
                    <div className="text-xs text-gray-500">{s.code}</div>
                  </Td>
                  <Td>{titleCase(s.module)}</Td>
                  <Td>
                    {s.areaName || "—"}
                    <div className="text-xs text-gray-500">{s.districtName}</div>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {s.isBanned ? <Badge tone="red">Banned</Badge> : null}
                      {!s.isActive ? <Badge>Inactive</Badge> : null}
                      {s.isClosed ? <Badge tone="amber">Closed</Badge> : null}
                      {s.isActive && !s.isBanned && !s.isClosed ? <Badge tone="green">Open</Badge> : null}
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
            <Pagination page={filters.page} total={stores.data.total} pageSize={stores.data.pageSize} onPage={(page) => setFilters({ ...filters, page })} />
          </>
        ) : (
          <Empty>No stores found.</Empty>
        )}
      </Card>
    </>
  );
}
