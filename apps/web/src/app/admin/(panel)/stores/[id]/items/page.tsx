"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { admin } from "@notension/shared";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, packLabel, taka, titleCase } from "@/components/Admin/api";
import { apiChecked, asNumber, errorText } from "@/components/Admin/forms";
import type { ItemEditMode } from "@/components/Admin/perms";
import type { Product, StoreDetail, StoreItem } from "@/components/Admin/types";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Empty,
  ErrorBox,
  Field,
  FieldError,
  Input,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  Select,
  Td,
  type ErrorLike,
} from "@/components/Admin/ui";
import { useZodForm } from "@/lib/forms/useZodForm";

type ItemKey = "salePrice" | "mrp" | "purchasePrice" | "stockQty" | "isAvailable" | "maxPerOrder" | "discount" | "discountType";

const NUM: readonly ItemKey[] = ["salePrice", "mrp", "purchasePrice", "stockQty", "maxPerOrder", "discount"];
const FULL: readonly ItemKey[] = ["salePrice", "mrp", "purchasePrice", "stockQty", "isAvailable", "maxPerOrder", "discount", "discountType"];
const STOCK: readonly ItemKey[] = ["stockQty", "isAvailable"];

// Number fields as strings (input values); isAvailable a boolean; discountType a string.
type ItemForm = Record<string, string | boolean>;

// The keys outside NUM are isAvailable (boolean) and discountType (string).
const toForm = (item: StoreItem): ItemForm =>
  Object.fromEntries(FULL.map((k) => [k, NUM.includes(k) ? String(item[k] ?? 0) : (item[k] as boolean | string)]));

// Each number checked by the API's own field schema (admin.priceFields) on
// the number it gets; unchanged values pass (only changes are sent).
const itemSchema = (initial: ItemForm) => {
  const api = admin.priceFields.shape;
  const shape: Record<string, z.ZodType> = { isAvailable: z.boolean(), discountType: admin.discountType };
  for (const k of NUM) shape[k] = apiChecked(api[k as keyof typeof api], asNumber, initial[k] as string);
  return z.object(shape) as unknown as z.ZodType<ItemForm, ItemForm>;
};

function ItemRow({ item, mode, onSaved }: { item: StoreItem; mode: ItemEditMode; onSaved: () => Promise<unknown> }) {
  const [editing, setEditing] = useState(false);
  const [initial] = useState(() => toForm(item));
  const [schema] = useState(() => itemSchema(initial));
  const form = useZodForm(schema, { defaultValues: initial });
  const errors = form.formState.errors;
  const patch = useMutation({
    mutationFn: (body: Record<string, string | number | boolean>) => adminApi(`/items/${item.id}`, { method: "PATCH", body }),
    onSuccess: async () => {
      setEditing(false);
      await onSaved();
    },
  });
  const busy = patch.isPending;
  const error: ErrorLike = patch.error;

  const save = form.handleSubmit((values) => {
    const keys = mode === "full" ? FULL : STOCK;
    const body: Record<string, string | number | boolean> = {};
    for (const k of keys) {
      const v = NUM.includes(k) ? Number(values[k] || 0) : values[k];
      if (v !== item[k]) body[k] = v;
    }
    if (!Object.keys(body).length) return setEditing(false);
    patch.mutate(body);
  });

  const quickToggle = () => patch.mutate({ isAvailable: !item.isAvailable });

  // Number fields hold strings in the form (see toForm); a table cell shows
  // the error under the input.
  const num = (k: ItemKey, props: InputHTMLAttributes<HTMLInputElement> = {}) => {
    const message = errorText(errors, k);
    const errorId = `item-${item.id}-${k}-error`;
    return (
      <>
        <Input
          type="number"
          min={0}
          step={k === "stockQty" || k === "maxPerOrder" ? 1 : 0.01}
          className="py-1"
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? errorId : undefined}
          {...props}
          {...form.register(k)}
        />
        {props["aria-label"] ? <FieldError id={errorId} error={message} /> : null}
      </>
    );
  };

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
            <Controller
              control={form.control}
              name="isAvailable"
              render={({ field }) => <Checkbox label="Available" checked={field.value as boolean} onChange={field.onChange} />}
            />
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
                    form.reset(initial);
                    setEditing(false);
                    patch.reset();
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
              <Field label="MRP (৳)" error={errorText(errors, "mrp")}>
                {(a) => num("mrp", a)}
              </Field>
              <Field label="Purchase price (৳)" error={errorText(errors, "purchasePrice")}>
                {(a) => num("purchasePrice", a)}
              </Field>
              <Field label="Max per order" hint="0 = no limit" error={errorText(errors, "maxPerOrder")}>
                {(a) => num("maxPerOrder", a)}
              </Field>
              <Field label="Discount" error={errorText(errors, "discount")}>
                {(a) => num("discount", a)}
              </Field>
              <Field label="Discount type">
                <Select {...form.register("discountType")} className="py-1">
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

// POST /stores/:id/items: sale price (empty = MRP) and stock, checked by
// the API's own field schemas.
const addItemSchema = z.object({
  price: apiChecked(admin.priceFields.shape.salePrice, (v) => (v.trim() === "" ? 0 : Number(v))),
  stock: apiChecked(admin.priceFields.shape.stockQty, asNumber),
});

function AddProduct({ store, onAdded }: { store: StoreDetail; onAdded: () => Promise<unknown> }) {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [picked, setPicked] = useState<Product | null>(null);
  const [notice, setNotice] = useState<ReactNode>(null);
  const form = useZodForm(addItemSchema, { defaultValues: { price: "", stock: "0" } });
  const errors = form.formState.errors;

  const results = useQuery({
    queryKey: ["admin", "products", { module: store.module, q: search }],
    queryFn: () => adminApi("/products", { query: { module: store.module, q: search }, result: admin.product.array() }),
    enabled: search.length > 0,
  });

  const addItem = useMutation({
    mutationFn: (p: { product: Product; salePrice: number; stockQty: number }) =>
      adminApi(`/stores/${store.id}/items`, {
        method: "POST",
        body: { productId: p.product.id, salePrice: p.salePrice, mrp: p.product.mrp, stockQty: p.stockQty },
        result: admin.createdId,
      }),
    onSuccess: async (_res, p) => {
      setNotice(`${p.product.titleEn} added to the store.`);
      setPicked(null);
      await onAdded();
    },
  });
  const busy = addItem.isPending;
  const error: ErrorLike = addItem.error;

  const add = form.handleSubmit(({ price, stock }) => {
    if (!picked) return; // unreachable: this form only shows once a product is picked
    setNotice(null);
    addItem.mutate({ product: picked, salePrice: Number(price || picked.mrp), stockQty: Number(stock || 0) });
  });

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
            <Field label="Sale price (৳)" error={errorText(errors, "price")}>
              {(a) => <Input {...a} type="number" min={0} step={0.01} placeholder={String(picked.mrp)} {...form.register("price")} />}
            </Field>
            <Field label="Stock" error={errorText(errors, "stock")}>
              {(a) => <Input {...a} type="number" min={0} step={1} {...form.register("stock")} />}
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
                        form.reset({ price: String(p.mrp), stock: "0" });
                        addItem.reset();
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
  const { id } = useParams<{ id: string }>();
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ q: "", page: 1 });
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const store = useQuery({
    queryKey: ["admin", "store", id],
    queryFn: () => adminApi(`/stores/${id}`, { result: admin.storeDetail }).then((r) => r.result),
  });
  const items = useQuery({
    queryKey: ["admin", "items", id, filters],
    queryFn: () => adminApi(`/stores/${id}/items`, { query: filters, result: admin.storeItem.array() }),
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
