"use client";

// Service provider panel (All Care): my listing. Customers call providers
// directly, so there are no bookings here; just keep the listing right.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { admin } from "@notension/shared";
import { adminApi } from "@/components/Admin/api";
import { apiChecked, asNullable, asNumber, asText, errorText } from "@/components/Admin/forms";
import type { ProviderListing } from "@/components/Admin/types";
import { useZodForm } from "@/lib/forms/useZodForm";
import { Badge, Button, Card, Empty, ErrorBox, Field, Input, Loading, PageHeader, inputClass } from "@/components/Admin/ui";
import { notify } from "@/utils/notify";

const FIELDS = ["contactPerson", "phone", "altPhone", "address", "serviceHours", "experienceYears", "serviceDetails"] as const;
const NULLABLE: readonly string[] = ["contactPerson", "phone", "altPhone", "serviceHours"];

// Each field checked by the API's own schema (admin.providerFields) on the
// value it gets. Inputs hold strings.
const api = admin.providerFields.shape;
const listingSchema = z.object(
  Object.fromEntries(
    FIELDS.map((k) => [k, apiChecked(api[k], k === "experienceYears" ? asNumber : NULLABLE.includes(k) ? asNullable : asText)]),
  ) as Record<(typeof FIELDS)[number], z.ZodString>,
);
type ListingValues = z.infer<typeof listingSchema>;

function ListingCard({ p, onChanged }: { p: ProviderListing; onChanged: () => Promise<unknown> }) {
  const form = useZodForm(listingSchema, {
    defaultValues: Object.fromEntries(FIELDS.map((k) => [k, String(p[k] ?? "")])) as ListingValues,
  });
  const errors = form.formState.errors;
  const live = p.status === "active";
  const patch = useMutation({
    mutationFn: ({ body }: { key: string; body: Record<string, unknown> }) =>
      adminApi(`/provider/listings/${p.id}`, { method: "PATCH", body }),
    onSuccess: async (res) => {
      notify.success(res.message ?? "Done");
      await onChanged();
    },
    onError: (err) => notify.error(err.message),
  });
  const busy = patch.isPending ? patch.variables.key : null;
  const save = (key: string, body: Record<string, unknown>) => patch.mutate({ key, body });

  const submit = form.handleSubmit((values) => {
    const body: Record<string, string | number | null> = {};
    for (const k of FIELDS) {
      const v = values[k].trim();
      body[k] = k === "experienceYears" ? Number(v || 0) : NULLABLE.includes(k) && !v ? null : v;
    }
    save("form", body);
  });

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
          <Field label="Contact person" error={errorText(errors, "contactPerson")}>
            {(a) => <Input {...a} {...form.register("contactPerson")} maxLength={100} />}
          </Field>
          <Field label="Service hours" hint="e.g. 9 AM - 9 PM, every day" error={errorText(errors, "serviceHours")}>
            {(a) => <Input {...a} {...form.register("serviceHours")} maxLength={200} />}
          </Field>
          <Field label="Phone" error={errorText(errors, "phone")}>
            {(a) => <Input {...a} type="tel" {...form.register("phone")} maxLength={20} placeholder="01XXXXXXXXX" />}
          </Field>
          <Field label="Other phone" error={errorText(errors, "altPhone")}>
            {(a) => <Input {...a} type="tel" {...form.register("altPhone")} maxLength={20} />}
          </Field>
          <Field label="Address" className="sm:col-span-2" error={errorText(errors, "address")}>
            {(a) => <Input {...a} {...form.register("address")} maxLength={300} />}
          </Field>
          <Field label="Years of experience" error={errorText(errors, "experienceYears")}>
            {(a) => <Input {...a} type="number" min="0" max="80" inputMode="numeric" {...form.register("experienceYears")} />}
          </Field>
          <Field
            label="About your service"
            className="sm:col-span-2"
            hint="What you do, prices or call-out charges, areas you cover."
            error={errorText(errors, "serviceDetails")}
          >
            {(a) => <textarea {...a} rows={5} className={inputClass} {...form.register("serviceDetails")} maxLength={3000} />}
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
    queryFn: () => adminApi("/provider/listings", { result: admin.providerListing.array() }).then((r) => r.result),
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
