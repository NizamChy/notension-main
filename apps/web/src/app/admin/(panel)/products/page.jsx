"use client";

import { useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, MODULES, packLabel, taka, titleCase } from "@/components/Admin/api";
import { Button, Card, Empty, ErrorBox, Field, Input, Loading, Notice, PageHeader, Pagination, Select, Table, Td } from "@/components/Admin/ui";

const TEXT = ["titleEn", "titleBn", "packSize", "unit", "image"];
const NULLABLE = ["titleBn", "packSize", "unit", "image", "subtypeId"];

const blank = (module) => ({ module, titleEn: "", titleBn: "", packSize: "", unit: "", mrp: "", image: "", typeId: "", subtypeId: "" });
const fromProduct = (p) => ({
  module: p.module,
  ...Object.fromEntries(TEXT.map((k) => [k, p[k] ?? ""])),
  mrp: String(p.mrp ?? ""),
  typeId: p.typeId ?? "",
  subtypeId: p.subtypeId ?? "",
});
const toApi = (form) => {
  const out = {};
  for (const k of [...TEXT, "typeId", "subtypeId"]) {
    const v = form[k].trim();
    out[k] = v === "" && NULLABLE.includes(k) ? null : v;
  }
  out.mrp = Number(form.mrp || 0);
  return out;
};

function ProductEditor({ product, module, onDone }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => (product ? fromProduct(product) : blank(module)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const types = useQuery({
    queryKey: ["admin", "product-types", form.module],
    queryFn: () => adminApi("/product-types", { query: { module: form.module } }).then((r) => r.result),
    staleTime: 5 * 60_000,
  });
  const type = types.data?.find((t) => t.id === form.typeId);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body = toApi(form);
      let res;
      if (product) {
        // Only what changed.
        const before = toApi(fromProduct(product));
        const changes = Object.fromEntries(Object.entries(body).filter(([k, v]) => v !== before[k]));
        if (!Object.keys(changes).length) return onDone(null);
        res = await adminApi(`/products/${product.id}`, { method: "PATCH", body: changes });
      } else {
        res = await adminApi("/products", { method: "POST", body: { ...body, module: form.module } });
      }
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      onDone(product ? res.message : `${form.titleEn.trim()} added to the catalogue.`);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <Card className="mb-4">
      <h2 className="mb-3 font-semibold text-gray-900">{product ? `Edit ${product.titleEn}` : "New product"}</h2>
      <form onSubmit={save} className="space-y-3">
        <ErrorBox error={error} />
        <div className="grid gap-3 sm:grid-cols-2">
          {!product ? (
            <Field label="Module">
              <Select value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value, typeId: "", subtypeId: "" })}>
                {MODULES.map((m) => (
                  <option key={m} value={m}>
                    {titleCase(m)}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Name (English)">
            <Input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} required minLength={2} />
          </Field>
          <Field label="Name (Bangla)">
            <Input value={form.titleBn} onChange={(e) => set("titleBn", e.target.value)} />
          </Field>
          <Field label="Pack size" hint="e.g. 500, 1, 12">
            <Input value={form.packSize} onChange={(e) => set("packSize", e.target.value)} />
          </Field>
          <Field label="Unit" hint="e.g. gm, kg, ltr, pcs">
            <Input value={form.unit} onChange={(e) => set("unit", e.target.value)} />
          </Field>
          <Field label="MRP (৳)">
            <Input type="number" min={0} step={0.01} value={form.mrp} onChange={(e) => set("mrp", e.target.value)} required />
          </Field>
          <Field label="Type">
            <Select value={form.typeId} onChange={(e) => setForm({ ...form, typeId: e.target.value, subtypeId: "" })} required>
              <option value="">{types.isPending ? "Loading…" : "Choose a type"}</option>
              {(types.data || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {t.kind === "Custom" ? " (promotion)" : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Subtype">
            <Select value={form.subtypeId} onChange={(e) => set("subtypeId", e.target.value)} disabled={!type?.subtypes.length}>
              <option value="">{type?.subtypes.length ? "None" : "No subtypes"}</option>
              {(type?.subtypes || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Image URL" className="sm:col-span-2">
            <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" />
          </Field>
        </div>
        <ErrorBox error={types.error} />
        <div className="flex gap-2">
          <Button type="submit" loading={busy}>
            {product ? "Save product" : "Add product"}
          </Button>
          <Button variant="ghost" onClick={() => onDone(null)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function ProductsPage() {
  const { perms } = useAdmin();
  const [filters, setFilters] = useState({ module: "grocery", q: "", page: 1 });
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [notice, setNotice] = useState(null);

  const products = useQuery({
    queryKey: ["admin", "products", filters],
    queryFn: () => adminApi("/products", { query: filters }),
    placeholderData: keepPreviousData,
  });

  const done = (message) => {
    setEditing(null);
    setNotice(message);
  };

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="The catalogue stores pick their items from."
        actions={
          perms.editProducts && !editing ? (
            <Button
              onClick={() => {
                setNotice(null);
                setEditing("new");
              }}
            >
              New product
            </Button>
          ) : null
        }
      />
      <Notice>{notice}</Notice>
      {editing ? (
        <ProductEditor
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? null : editing}
          module={filters.module || "grocery"}
          onDone={done}
        />
      ) : null}

      <Card className="mb-4">
        <form
          className="grid gap-2 sm:grid-cols-[1fr_200px_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({ ...filters, q: search.trim(), page: 1 });
          }}
        >
          <Input placeholder="Search by name (English or Bangla)" value={search} onChange={(e) => setSearch(e.target.value)} />
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

      <Card>
        <ErrorBox error={products.error} onRetry={() => products.refetch()} />
        {products.isPending ? (
          <Loading />
        ) : products.data?.result.length ? (
          <>
            <Table head={["Product", "Module", "Type", "MRP", ""]}>
              {products.data.result.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <p className="font-medium text-gray-900">{p.titleEn}</p>
                    <p className="text-xs text-gray-500">
                      {[p.titleBn, packLabel(p)].filter(Boolean).join(" · ")}
                    </p>
                  </Td>
                  <Td>{titleCase(p.module)}</Td>
                  <Td>
                    {p.typeName || "—"}
                    {p.subtypeName ? <div className="text-xs text-gray-500">{p.subtypeName}</div> : null}
                  </Td>
                  <Td className="whitespace-nowrap">{taka(p.mrp)}</Td>
                  <Td className="text-right">
                    {perms.editProducts ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setNotice(null);
                          setEditing(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </Button>
                    ) : null}
                  </Td>
                </tr>
              ))}
            </Table>
            <Pagination page={filters.page} total={products.data.total} pageSize={products.data.pageSize} onPage={(page) => setFilters({ ...filters, page })} />
          </>
        ) : (
          <Empty>No products found.</Empty>
        )}
      </Card>
    </>
  );
}
