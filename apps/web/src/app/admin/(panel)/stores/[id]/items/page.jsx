"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, packLabel, taka, titleCase } from "@/components/Admin/api";
import { Badge, Button, Card, Checkbox, Empty, ErrorBox, Field, Input, Loading, Notice, PageHeader, Pagination, Select, Td } from "@/components/Admin/ui";

const NUM = ["salePrice", "mrp", "purchasePrice", "stockQty", "maxPerOrder", "discount"];
const FULL = ["salePrice", "mrp", "purchasePrice", "stockQty", "isAvailable", "maxPerOrder", "discount", "discountType"];
const STOCK = ["stockQty", "isAvailable"];

const toForm = (item) => Object.fromEntries(FULL.map((k) => [k, NUM.includes(k) ? String(item[k] ?? 0) : item[k]]));

function ItemRow({ item, mode, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toForm(item));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const keys = mode === "full" ? FULL : STOCK;
    const body = {};
    for (const k of keys) {
      const v = NUM.includes(k) ? Number(form[k] || 0) : form[k];
      if (v !== item[k]) body[k] = v;
    }
    if (!Object.keys(body).length) return setEditing(false);
    setBusy(true);
    setError(null);
    try {
      await adminApi(`/items/${item.id}`, { method: "PATCH", body });
      setEditing(false);
      await onSaved();
    } catch (err) {
      setError(err);
    }
    setBusy(false);
  };

  const quickToggle = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminApi(`/items/${item.id}`, { method: "PATCH", body: { isAvailable: !item.isAvailable } });
      await onSaved();
    } catch (err) {
      setError(err);
    }
    setBusy(false);
  };

  const num = (k, props = {}) => (
    <Input type="number" min={0} step={k === "stockQty" || k === "maxPerOrder" ? 1 : 0.01} value={form[k]} onChange={(e) => set(k, e.target.value)} className="py-1" {...props} />
  );

  return (
    <>
      <tr className={editing ? "bg-gray-50" : undefined}>
        <Td>
          <p className="font-medium text-gray-900">{item.titleEn}</p>
          <p className="text-xs text-gray-500">{packLabel(item)}</p>
        </Td>
        <Td className="w-28">
          {editing && mode === "full" ? (
            num("salePrice", { "aria-label": "Sale price" })
          ) : (
            <span className="whitespace-nowrap">
              {taka(item.salePrice)}
              {item.mrp > item.salePrice ? <span className="block text-xs text-gray-400 line-through">{taka(item.mrp)}</span> : null}
            </span>
          )}
        </Td>
        <Td className="w-24">{editing ? num("stockQty", { "aria-label": "Stock" }) : item.stockQty}</Td>
        <Td>
          {editing ? (
            <Checkbox label="Available" checked={form.isAvailable} onChange={(v) => set("isAvailable", v)} />
          ) : item.isAvailable ? (
            <Badge tone="green">Available</Badge>
          ) : (
            <Badge tone="red">Unavailable</Badge>
          )}
        </Td>
        <Td className="whitespace-nowrap text-right">
          {mode ? (
            editing ? (
              <span className="inline-flex gap-1.5">
                <Button size="sm" onClick={save} loading={busy}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setForm(toForm(item));
                    setEditing(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </span>
            ) : (
              <span className="inline-flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={quickToggle} loading={busy}>
                  {item.isAvailable ? "Mark unavailable" : "Mark available"}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </span>
            )
          ) : null}
        </Td>
      </tr>
      {editing && mode === "full" ? (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <Field label="MRP (৳)">{num("mrp")}</Field>
              <Field label="Purchase price (৳)">{num("purchasePrice")}</Field>
              <Field label="Max per order" hint="0 = no limit">
                {num("maxPerOrder")}
              </Field>
              <Field label="Discount">{num("discount")}</Field>
              <Field label="Discount type">
                <Select value={form.discountType} onChange={(e) => set("discountType", e.target.value)} className="py-1">
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat (৳)</option>
                </Select>
              </Field>
            </div>
          </td>
        </tr>
      ) : null}
      {error ? (
        <tr>
          <td colSpan={5} className="px-3">
            <ErrorBox error={error} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function AddProduct({ store, onAdded }) {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const results = useQuery({
    queryKey: ["admin", "products", { module: store.module, q: search }],
    queryFn: () => adminApi("/products", { query: { module: store.module, q: search } }),
    enabled: search.length > 0,
  });

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await adminApi(`/stores/${store.id}/items`, {
        method: "POST",
        body: { productId: picked.id, salePrice: Number(price || picked.mrp), mrp: picked.mrp, stockQty: Number(stock || 0) },
      });
      setNotice(`${picked.titleEn} added to the store.`);
      setPicked(null);
      await onAdded();
    } catch (err) {
      setError(err);
    }
    setBusy(false);
  };

  return (
    <Card className="mb-4">
      <h2 className="mb-3 font-semibold text-gray-900">Add a product</h2>
      <ErrorBox error={error} />
      <Notice>{notice}</Notice>
      {picked ? (
        <form onSubmit={add} className="space-y-3">
          <p className="text-sm">
            <span className="font-medium">{picked.titleEn}</span>{" "}
            <span className="text-gray-500">
              {packLabel(picked)} · MRP {taka(picked.mrp)}
            </span>
          </p>
          <div className="grid gap-2 sm:grid-cols-[160px_160px_auto]">
            <Field label="Sale price (৳)">
              <Input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} placeholder={String(picked.mrp)} />
            </Field>
            <Field label="Stock">
              <Input type="number" min={0} step={1} value={stock} onChange={(e) => setStock(e.target.value)} />
            </Field>
            <div className="flex items-end gap-2">
              <Button type="submit" loading={busy}>
                Add to store
              </Button>
              <Button variant="ghost" onClick={() => setPicked(null)}>
                Back
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(q.trim());
            }}
          >
            <Input placeholder={`Search the ${titleCase(store.module).toLowerCase()} catalogue`} value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
          <ErrorBox error={results.error} />
          {search && results.isFetching ? <Loading label="Searching…" /> : null}
          {search && results.data ? (
            results.data.result.length ? (
              <ul className="mt-3 divide-y divide-gray-100">
                {results.data.result.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span>
                      {p.titleEn}{" "}
                      <span className="text-gray-500">
                        {packLabel(p)} · {taka(p.mrp)}
                      </span>
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setPicked(p);
                        setPrice(String(p.mrp));
                        setStock("0");
                        setNotice(null);
                      }}
                    >
                      Choose
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No products match “{search}”.</Empty>
            )
          ) : null}
        </>
      )}
    </Card>
  );
}

export default function StoreItemsPage() {
  const { id } = useParams();
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ q: "", page: 1 });
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const store = useQuery({ queryKey: ["admin", "store", id], queryFn: () => adminApi(`/stores/${id}`).then((r) => r.result) });
  const items = useQuery({
    queryKey: ["admin", "items", id, filters],
    queryFn: () => adminApi(`/stores/${id}/items`, { query: filters }),
    placeholderData: keepPreviousData,
  });
  const mode = perms.itemEdit(id);
  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", "items", id] });

  return (
    <>
      <PageHeader
        back={{ href: `/admin/stores/${id}`, label: store.data?.name || "Store" }}
        title="Items"
        subtitle={
          mode === "stock"
            ? "You can change stock and availability."
            : mode === "full"
              ? "Prices, stock and availability for this store."
              : "Read only."
        }
        actions={
          mode === "full" ? (
            <Button variant={adding ? "secondary" : "primary"} onClick={() => setAdding(!adding)}>
              {adding ? "Close" : "Add product"}
            </Button>
          ) : null
        }
      />
      {adding && store.data ? <AddProduct store={store.data} onAdded={reload} /> : null}

      <Card>
        <form
          className="mb-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({ q: search.trim(), page: 1 });
          }}
        >
          <Input placeholder="Search this store's items" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <ErrorBox error={items.error} onRetry={() => items.refetch()} />
        {items.isPending ? (
          <Loading />
        ) : items.data?.result.length ? (
          <>
            <div className="-mx-4 overflow-x-auto md:mx-0">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-3 py-2 font-medium">Product</th>
                    <th className="px-3 py-2 font-medium">Price</th>
                    <th className="px-3 py-2 font-medium">Stock</th>
                    <th className="px-3 py-2 font-medium">Availability</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.data.result.map((it) => (
                    // Remount after a save so the row's form starts from the saved values.
                    <ItemRow key={`${it.id}-${items.dataUpdatedAt}`} item={it} mode={mode} onSaved={reload} />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={filters.page} total={items.data.total} pageSize={items.data.pageSize} onPage={(page) => setFilters({ ...filters, page })} />
          </>
        ) : (
          <Empty>{filters.q ? "No items match this search." : "This store has no items yet."}</Empty>
        )}
      </Card>
    </>
  );
}
