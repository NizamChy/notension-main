"use client";

// Store settings fields, shared by the store page (edit) and Add store.
import { useQuery } from "@tanstack/react-query";
import { Controller, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { admin } from "@notension/shared";
import { adminApi } from "./api";
import { apiChecked, asNullable, asNumber, asText, errorText } from "./forms";
import type { Store } from "./types";
import { Checkbox, Field, Input, Select } from "./ui";

// kind: text | ntext (empty = null) | money | number | time | bool | discountType | district
export type FieldKind = "text" | "ntext" | "money" | "number" | "time" | "bool" | "discountType" | "district";

export type StoreField = {
  key: keyof Store;
  label: string;
  kind: FieldKind;
  required?: boolean;
  wide?: boolean;
  hint?: string;
};

// Form state: booleans for "bool" fields, strings for the rest (see toForm).
export type StoreForm = Record<string, string | boolean>;

export type DistrictOption = { id: string; name: string };

export const ADMIN_FIELDS: StoreField[] = [
  { key: "name", label: "Store name", kind: "text", required: true },
  { key: "address", label: "Address", kind: "text", wide: true, required: true },
  { key: "areaName", label: "Area", kind: "ntext" },
  { key: "districtId", label: "District", kind: "district" },
  { key: "latitude", label: "Latitude", kind: "number", required: true },
  { key: "longitude", label: "Longitude", kind: "number", required: true },
  { key: "isActive", label: "Active (listed for customers)", kind: "bool" },
  { key: "showPrice", label: "Show prices", kind: "bool" },
  { key: "isBanned", label: "Banned", kind: "bool" },
];

export const MERCHANT_FIELDS: StoreField[] = [
  { key: "isClosed", label: "Closed right now (not taking orders)", kind: "bool" },
  { key: "phone", label: "Phone", kind: "text" },
  { key: "altPhone", label: "Other phone", kind: "text" },
  { key: "opensAt", label: "Opens at", kind: "time", hint: "e.g. 09:00 AM (or 09:00). Leave empty if not set." },
  { key: "closesAt", label: "Closes at", kind: "time", hint: "e.g. 10:30 PM (or 22:30). Leave empty if not set." },
  { key: "deliveryNotice", label: "Delivery notice", kind: "text", wide: true, hint: "Shown to customers on the store page." },
  { key: "minOrder", label: "Minimum order (৳)", kind: "money" },
  { key: "minDeliveryCharge", label: "Minimum delivery charge (৳)", kind: "money" },
  { key: "maxDeliveryCharge", label: "Maximum delivery charge (৳)", kind: "money" },
  { key: "discount", label: "Store discount", kind: "money" },
  { key: "discountType", label: "Discount type", kind: "discountType" },
  { key: "maxDiscount", label: "Maximum discount (৳)", kind: "money" },
  { key: "minOrderForDiscount", label: "Minimum order for discount (৳)", kind: "money" },
  { key: "bannerApp", label: "App banner image URL", kind: "ntext", wide: true },
  { key: "bannerWeb", label: "Web banner image URL", kind: "ntext", wide: true },
];

// Store value -> form value
export function toForm(fields: StoreField[], store: Partial<Store> = {}): StoreForm {
  const v: StoreForm = {};
  for (const f of fields) {
    const raw = store[f.key];
    if (f.kind === "bool") v[f.key] = !!raw;
    else if (f.kind === "discountType") v[f.key] = (raw as Store["discountType"] | undefined) || "percent";
    else v[f.key] = raw == null ? "" : String(raw);
  }
  return v;
}

// Form value -> API value
export function fromForm(field: StoreField, value: string | boolean): string | number | boolean | null {
  switch (field.kind) {
    case "bool":
      return !!value;
    case "money":
    case "number":
      return value === "" ? 0 : Number(value);
    case "ntext":
    case "time":
      // Text fields hold strings (see toForm).
      return (value as string).trim() === "" ? null : (value as string).trim();
    default:
      return typeof value === "string" ? value.trim() : value;
  }
}

// Form schema for these fields: each checked by the API's own field schema
// (admin.adminStoreFields) on the value the API gets. With `initial`
// (editing), unchanged values pass: only changes are sent.
export function storeFormSchema(fields: StoreField[], initial?: StoreForm, extra: Record<string, z.ZodType> = {}) {
  const api = admin.adminStoreFields.shape;
  const shape: Record<string, z.ZodType> = { ...extra };
  for (const f of fields) {
    const before = initial?.[f.key];
    const unchanged = typeof before === "string" ? before : undefined;
    const check = api[f.key as keyof typeof api];
    if (f.kind === "bool") shape[f.key] = z.boolean();
    else if (f.kind === "money" || f.kind === "number") shape[f.key] = apiChecked(check, asNumber, unchanged);
    else if (f.kind === "ntext" || f.kind === "time") shape[f.key] = apiChecked(check, asNullable, unchanged);
    else shape[f.key] = apiChecked(check, asText, unchanged);
  }
  // Booleans for "bool" fields, strings for the rest (see toForm).
  return z.object(shape) as unknown as z.ZodType<StoreForm, StoreForm>;
}

// Only the fields that differ from the saved store.
export function changedFields(fields: StoreField[], form: StoreForm, store: Partial<Store>) {
  const initial = toForm(fields, store);
  const out: Record<string, string | number | boolean | null> = {};
  for (const f of fields) {
    if (fromForm(f, form[f.key]) !== fromForm(f, initial[f.key])) out[f.key] = fromForm(f, form[f.key]);
  }
  return out;
}

// Every district, for the store's district picker.
export function useKnownDistricts(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "districts"],
    enabled,
    staleTime: 60 * 60_000,
    queryFn: async (): Promise<DistrictOption[]> =>
      (await adminApi("/districts", { result: admin.district.array() })).result.map((d) => ({ id: d.id, name: d.name })),
  });
}

type StoreFieldsProps = {
  fields: StoreField[];
  form: UseFormReturn<StoreForm>;
  districts?: DistrictOption[];
  current?: DistrictOption;
};

export function StoreFields({ fields, form, districts, current }: StoreFieldsProps) {
  const { register, control } = form;
  const errors = form.formState.errors;
  const bools = fields.filter((f) => f.kind === "bool");
  const rest = fields.filter((f) => f.kind !== "bool");
  return (
    <div className="space-y-4">
      {bools.length ? (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {bools.map((f) => (
            <Controller
              key={f.key}
              control={control}
              name={f.key}
              render={({ field }) => <Checkbox label={f.label} checked={field.value as boolean} onChange={field.onChange} />}
            />
          ))}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {rest.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint} error={errorText(errors, f.key)} className={f.wide ? "sm:col-span-2" : undefined}>
            {(a) => f.kind === "discountType" ? (
              <Select {...a} {...register(f.key)}>
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (৳)</option>
              </Select>
            ) : f.kind === "district" ? (
              // Controlled: the options arrive after the form mounts.
              <Controller
                control={control}
                name={f.key}
                render={({ field }) => (
                  <Select {...a} {...field} value={field.value as string} required>
                    <option value="">Choose a district</option>
                    {current && !districts?.some((d) => d.id === current.id) ? <option value={current.id}>{current.name}</option> : null}
                    {(districts || []).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            ) : (
              <Input
                {...a}
                {...register(f.key)}
                type={f.kind === "money" || f.kind === "number" ? "number" : "text"}
                step={f.kind === "number" ? "any" : f.kind === "money" ? "0.01" : undefined}
                min={f.kind === "money" ? 0 : undefined}
                placeholder={f.kind === "time" ? "09:00 AM" : undefined}
                required={f.required}
                inputMode={f.kind === "money" || f.kind === "number" ? "decimal" : undefined}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );
}
