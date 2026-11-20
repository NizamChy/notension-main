"use client";

// Store settings fields, shared by the store page (edit) and Add store.
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "./api";
import { Checkbox, Field, Input, Select } from "./ui";

// kind: text | ntext (empty = null) | money | number | time | bool | discountType | district
export const ADMIN_FIELDS = [
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

export const MERCHANT_FIELDS = [
  { key: "isClosed", label: "Closed right now (not taking orders)", kind: "bool" },
  { key: "phone", label: "Phone", kind: "text" },
  { key: "altPhone", label: "Other phone", kind: "text" },
  { key: "opensAt", label: "Opens at", kind: "time", hint: "24-hour, e.g. 09:00. Empty = not set." },
  { key: "closesAt", label: "Closes at", kind: "time", hint: "24-hour, e.g. 22:30. Empty = not set." },
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
export function toForm(fields, store = {}) {
  const v = {};
  for (const f of fields) {
    const raw = store[f.key];
    if (f.kind === "bool") v[f.key] = !!raw;
    else if (f.kind === "discountType") v[f.key] = raw || "percent";
    else v[f.key] = raw == null ? "" : String(raw);
  }
  return v;
}

// Form value -> API value
export function fromForm(field, value) {
  switch (field.kind) {
    case "bool":
      return !!value;
    case "money":
    case "number":
      return value === "" ? 0 : Number(value);
    case "ntext":
    case "time":
      return value.trim() === "" ? null : value.trim();
    default:
      return typeof value === "string" ? value.trim() : value;
  }
}

// Only the fields that differ from the saved store.
export function changedFields(fields, form, store) {
  const initial = toForm(fields, store);
  const out = {};
  for (const f of fields) {
    if (fromForm(f, form[f.key]) !== fromForm(f, initial[f.key])) out[f.key] = fromForm(f, form[f.key]);
  }
  return out;
}

// The API has no district list yet, so the picker offers the districts
// existing stores are in (plus the current one).
export function useKnownDistricts(enabled) {
  return useQuery({
    queryKey: ["admin", "known-districts"],
    enabled,
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const seen = new Map();
      for (let page = 1; page <= 8; page++) {
        const res = await adminApi("/stores", { query: { page } });
        for (const s of res.result) if (s.districtId && !seen.has(s.districtId)) seen.set(s.districtId, s.districtName || s.districtId);
        if (page * (res.pageSize || 25) >= res.total) break;
      }
      return [...seen].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

export function StoreFields({ fields, form, setForm, districts, current }) {
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const bools = fields.filter((f) => f.kind === "bool");
  const rest = fields.filter((f) => f.kind !== "bool");
  return (
    <div className="space-y-4">
      {bools.length ? (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {bools.map((f) => (
            <Checkbox key={f.key} label={f.label} checked={form[f.key]} onChange={(v) => set(f.key, v)} />
          ))}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {rest.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint} className={f.wide ? "sm:col-span-2" : undefined}>
            {f.kind === "discountType" ? (
              <Select value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                <option value="percent">Percent (%)</option>
                <option value="flat">Flat (৳)</option>
              </Select>
            ) : f.kind === "district" ? (
              <Select value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} required>
                <option value="">Choose a district</option>
                {current && !districts?.some((d) => d.id === current.id) ? <option value={current.id}>{current.name}</option> : null}
                {(districts || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                type={f.kind === "money" || f.kind === "number" ? "number" : "text"}
                step={f.kind === "number" ? "any" : f.kind === "money" ? "0.01" : undefined}
                min={f.kind === "money" ? 0 : undefined}
                placeholder={f.kind === "time" ? "HH:MM" : undefined}
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
