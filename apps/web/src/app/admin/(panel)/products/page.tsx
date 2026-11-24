"use client";

import { useState, type ReactNode } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { admin } from "@notension/shared";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, MODULES, packLabel, taka, titleCase } from "@/components/Admin/api";
import { apiChecked, asNullable, asNumber, asText, errorText } from "@/components/Admin/forms";
import type { Product } from "@/components/Admin/types";
import { Button, Card, Empty, ErrorBox, Field, Input, Loading, Notice, PageHeader, Pagination, Select, Table, Td } from "@/components/Admin/ui";
import { useZodForm } from "@/lib/forms/useZodForm";

const TEXT = ["titleEn", "titleBn", "packSize", "unit", "image"] as const;
const NULLABLE: readonly string[] = ["titleBn", "packSize", "unit", "image", "subtypeId"];

// Every field as the input's string value.
type ProductForm = Record<string, string>;

const blank = (module: string): ProductForm => ({ module, titleEn: "", titleBn: "", packSize: "", unit: "", mrp: "", image: "", typeId: "", subtypeId: "" });
const fromProduct = (p: Product): ProductForm => ({
  module: p.module,
  ...Object.fromEntries(TEXT.map((k) => [k, p[k] ?? ""])),
  mrp: String(p.mrp ?? ""),
  typeId: p.typeId ?? "",
  subtypeId: p.subtypeId ?? "",
});
const toApi = (form: ProductForm) => {
  const out: Record<string, string | number | null> = {};
  for (const k of [...TEXT, "typeId", "subtypeId"]) {
    const v = form[k].trim();
    out[k] = v === "" && NULLABLE.includes(k) ? null : v;
  }
  out.mrp = Number(form.mrp || 0);
  return out;
};

// Each field checked by the API's own schema (admin.productFields) on the
// value it gets; when editing, unchanged values pass (only changes are sent).
const productSchema = (initial: ProductForm, editing: boolean) => {
  const api = admin.productFields.shape;
  const keep = (k: string) => (editing ? initial[k] : undefined);
  return z.object({
    module: z.string(),
    titleEn: apiChecked(api.titleEn, asText, keep("titleEn")),
    titleBn: apiChecked(api.titleBn, asNullable, keep("titleBn")),
    packSize: apiChecked(api.packSize, asNullable, keep("packSize")),
    unit: apiChecked(api.unit, asNullable, keep("unit")),
    mrp: apiChecked(api.mrp, asNumber, keep("mrp")),
    image: apiChecked(api.image, asNullable, keep("image")),
    typeId: apiChecked(api.typeId, asText, keep("typeId")),
    subtypeId: apiChecked(api.subtypeId, asNullable, keep("subtypeId")),
  });
};

type ProductEditorProps = {
  product: Product | null;
  module: string;
  onDone: (message: ReactNode) => void;
};

function ProductEditor({ product, module, onDone }: ProductEditorProps) {
  const queryClient = useQueryClient();
  const [initial] = useState(() => (product ? fromProduct(product) : blank(module)));
  const [schema] = useState(() => productSchema(initial, !!product));
  const form = useZodForm(schema, { defaultValues: initial });
  const errors = form.formState.errors;
  const [formModule, typeId] = form.watch(["module", "typeId"]);

  const types = useQuery({
    queryKey: ["admin", "product-types", formModule],
    queryFn: () => adminApi("/product-types", { query: { module: formModule }, result: admin.productType.array() }).then((r) => r.result),
    staleTime: 5 * 60_000,
  });
  const type = types.data?.find((t) => t.id === typeId);

  const saveProduct = useMutation({
    mutationFn: (values: ProductForm) => {
      const body = toApi(values);
      if (product) {
        // Only what changed.
        const before = toApi(fromProduct(product));
        const changes = Object.fromEntries(Object.entries(body).filter(([k, v]) => v !== before[k]));
        if (!Object.keys(changes).length) return Promise.resolve(null);
        return adminApi(`/products/${product.id}`, { method: "PATCH", body: changes });
      }
      return adminApi("/products", { method: "POST", body: { ...body, module: values.module }, result: admin.createdId });
    },
    onSuccess: async (res, values) => {
      if (!res) return onDone(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      onDone(product ? res.message : `${values.titleEn.trim()} added to the catalogue.`);
    },
  });
  // Stays busy after a save, until the editor closes.
  const busy = saveProduct.isPending || saveProduct.isSuccess;

  const save = form.handleSubmit((values) => saveProduct.mutate(values));

  return (
    <Card className="mb-4">
      <h2 className="mb-3 font-semibold text-gray-900">{product ? `Edit ${product.titleEn}` : "New product"}</h2>
      <form onSubmit={save} className="space-y-3">
        <ErrorBox error={saveProduct.error} />
        <div className="grid gap-3 sm:grid-cols-2">
          {!product ? (
            <Field label="Module">
              <Select
                {...form.register("module", {
                  onChange: () => {
                    form.setValue("typeId", "");
                    form.setValue("subtypeId", "");
                  },
                })}
              >
                {MODULES.map((m) => (
                  <option key={m} value={m}>
                    {titleCase(m)}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Name (English)" error={errorText(errors, "titleEn")}>
            {(a) => <Input {...a} {...form.register("titleEn")} required minLength={2} />}
          </Field>
          <Field label="Name (Bangla)" error={errorText(errors, "titleBn")}>
            {(a) => <Input {...a} {...form.register("titleBn")} />}
          </Field>
          <Field label="Pack size" hint="e.g. 500, 1, 12" error={errorText(errors, "packSize")}>
            {(a) => <Input {...a} {...form.register("packSize")} />}
          </Field>
          <Field label="Unit" hint="e.g. gm, kg, ltr, pcs" error={errorText(errors, "unit")}>
            {(a) => <Input {...a} {...form.register("unit")} />}
          </Field>
          <Field label="MRP (৳)" error={errorText(errors, "mrp")}>
            {(a) => <Input {...a} type="number" min={0} step={0.01} {...form.register("mrp")} required />}
          </Field>
          <Field label="Type" error={errorText(errors, "typeId")}>
            {(a) => (
              // Controlled: the options load after the form mounts.
              <Controller
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <Select
                    {...a}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue("subtypeId", "");
                    }}
                    required
                  >
                    <option value="">{types.isPending ? "Loading…" : "Choose a type"}</option>
                    {(types.data || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                        {t.kind === "Custom" ? " (promotion)" : ""}
                      </option>
                    ))}
                  </Select>
                )}
              />
            )}
          </Field>
          <Field label="Subtype" error={errorText(errors, "subtypeId")}>
            {(a) => (
              <Controller
                control={form.control}
                name="subtypeId"
                render={({ field }) => (
                  <Select {...a} {...field} disabled={!type?.subtypes.length}>
                    <option value="">{type?.subtypes.length ? "None" : "No subtypes"}</option>
                    {(type?.subtypes || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            )}
          </Field>
          <Field label="Image URL" className="sm:col-span-2" error={errorText(errors, "image")}>
            {(a) => <Input {...a} {...form.register("image")} placeholder="https://…" />}
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
  const [editing, setEditing] = useState<null | "new" | Product>(null); // null | "new" | product
  const [notice, setNotice] = useState<ReactNode>(null);

  const products = useQuery({
    queryKey: ["admin", "products", filters],
    queryFn: () => adminApi("/products", { query: filters, result: admin.product.array() }),
    placeholderData: keepPreviousData,
  });

  const done = (message: ReactNode) => {
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
