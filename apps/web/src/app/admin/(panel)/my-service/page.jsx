"use client";

// Service provider panel (All Care): my listing. Customers call providers
// directly, so there are no bookings here; just keep the listing right.
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/components/Admin/api";
import { Badge, Button, Card, Empty, ErrorBox, Field, Input, Loading, PageHeader, inputClass } from "@/components/Admin/ui";
import { notify } from "@/utils/notify";

const FIELDS = ["contactPerson", "phone", "altPhone", "address", "serviceHours", "experienceYears", "serviceDetails"];
const NULLABLE = ["contactPerson", "phone", "altPhone", "serviceHours"];

function ListingCard({ p, onChanged }) {
  const [form, setForm] = useState(() => Object.fromEntries(FIELDS.map((k) => [k, p[k] ?? ""])));
  const [busy, setBusy] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const live = p.status === "active";

  const save = async (key, body) => {
    setBusy(key);
    try {
      const res = await adminApi(`/provider/listings/${p.id}`, { method: "PATCH", body });
      notify.success(res.message);
      await onChanged();
    } catch (err) {
      notify.error(err.message);
    }
    setBusy(null);
  };

  const submit = (e) => {
    e.preventDefault();
    const body = {};
    for (const k of FIELDS) {
      const v = String(form[k] ?? "").trim();
      body[k] = k === "experienceYears" ? Number(v || 0) : NULLABLE.includes(k) && !v ? null : v;
    }
    save("form", body);
  };

  return (
    <div className="space-y-4">
      <Card className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900">{p.name}</p>
            <p className="text-sm text-gray-600">{p.districtName}</p>
            {p.services.length ? <p className="mt-1 text-sm text-gray-700">{p.services.join(", ")}</p> : null}
            {p.totalReviews ? (
              <p className="mt-1 text-xs text-gray-500">
                Rated {Number(p.rating).toFixed(1)} from {p.totalReviews} review{p.totalReviews === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
          <Badge tone={live ? "green" : "gray"}>{live ? "Live" : "Hidden"}</Badge>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          {live ? "Customers can find you in All Care." : "Customers can't see you right now."}
        </p>
        <Button
          className="mt-2 min-h-11 w-full sm:w-auto"
          variant={live ? "secondary" : "primary"}
          loading={busy === "status"}
          onClick={() => save("status", { status: live ? "inactive" : "active" })}
        >
          {live ? "Pause my listing" : "Make my listing live"}
        </Button>
      </Card>

      <Card className="p-3 md:p-4">
        <h2 className="mb-3 font-semibold text-gray-900">Details customers see</h2>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <Field label="Contact person">
            <Input value={form.contactPerson} onChange={set("contactPerson")} maxLength={100} />
          </Field>
          <Field label="Service hours" hint="e.g. 9 AM - 9 PM, every day">
            <Input value={form.serviceHours} onChange={set("serviceHours")} maxLength={200} />
          </Field>
          <Field label="Phone">
            <Input type="tel" value={form.phone} onChange={set("phone")} maxLength={20} placeholder="01XXXXXXXXX" />
          </Field>
          <Field label="Other phone">
            <Input type="tel" value={form.altPhone} onChange={set("altPhone")} maxLength={20} />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <Input value={form.address} onChange={set("address")} maxLength={300} />
          </Field>
          <Field label="Years of experience">
            <Input type="number" min="0" max="80" inputMode="numeric" value={form.experienceYears} onChange={set("experienceYears")} />
          </Field>
          <Field label="About your service" className="sm:col-span-2" hint="What you do, prices or call-out charges, areas you cover.">
            <textarea rows={5} className={inputClass} value={form.serviceDetails} onChange={set("serviceDetails")} maxLength={3000} />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" loading={busy === "form"} className="min-h-11 w-full sm:w-auto">
              Save details
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function MyServicePage() {
  const queryClient = useQueryClient();
  const list = useQuery({
    queryKey: ["admin", "provider-listings"],
    queryFn: () => adminApi("/provider/listings").then((r) => r.result),
  });
  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", "provider-listings"] });

  return (
    <>
      <PageHeader title="My service" subtitle="Your All Care listing." />
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
        Customers call you directly from your listing, so there are no booking requests here. Keep your phone number and hours up to date.
      </div>
      <ErrorBox error={list.error} onRetry={() => list.refetch()} />
      {list.isPending ? (
        <Loading />
      ) : list.data?.length ? (
        <div className="space-y-6">
          {list.data.map((p) => (
            <ListingCard key={`${p.id}-${p.status}`} p={p} onChanged={reload} />
          ))}
        </div>
      ) : list.data ? (
        <Card>
          <Empty>No listing is linked to your account yet. Ask a NoTension admin to link your service.</Empty>
        </Card>
      ) : null}
    </>
  );
}
