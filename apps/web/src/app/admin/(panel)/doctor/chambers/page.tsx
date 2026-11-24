"use client";

// Doctor panel: my chambers. Open or close booking, and set the fees.
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { admin } from "@notension/shared";
import { adminApi, taka } from "@/components/Admin/api";
import { apiChecked, asNumber, errorText } from "@/components/Admin/forms";
import { ProfileError, useDoctorProfile } from "@/components/Admin/DoctorPanel";
import type { Chamber } from "@/components/Admin/types";
import { Badge, Button, Card, Empty, Field, Input, Loading, PageHeader } from "@/components/Admin/ui";
import { useZodForm } from "@/lib/forms/useZodForm";
import { notify } from "@/utils/notify";

// The fees, checked by the API's own schema (admin.chamberFields).
const feesSchema = z.object({
  consultationFee: apiChecked(admin.chamberFields.shape.consultationFee, asNumber),
  followUpFee: apiChecked(admin.chamberFields.shape.followUpFee, asNumber),
});

function ChamberCard({ ch, onChanged }: { ch: Chamber; onChanged: () => Promise<unknown> }) {
  const [editing, setEditing] = useState(false);
  const form = useZodForm(feesSchema, {
    defaultValues: { consultationFee: String(ch.consultationFee), followUpFee: String(ch.followUpFee) },
  });
  const errors = form.formState.errors;
  const patch = useMutation({
    mutationFn: ({ body }: { key: string; body: Record<string, unknown> }) =>
      adminApi(`/doctor/chambers/${ch.id}`, { method: "PATCH", body }),
    onSuccess: async (res) => {
      notify.success(res.message ?? "Done");
      setEditing(false);
      await onChanged();
    },
    onError: (err) => notify.error(err.message),
  });
  const busy = patch.isPending ? patch.variables.key : null;
  const save = (key: string, body: Record<string, unknown>) => patch.mutate({ key, body });

  return (
    <Card className="p-3 md:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{ch.centerName}</p>
          <p className="text-xs text-gray-500">
            {ch.centerType}
            {ch.roomNo ? ` · Room ${ch.roomNo}` : ""}
          </p>
          {ch.centerAddress ? <p className="mt-0.5 text-sm text-gray-600">{ch.centerAddress}</p> : null}
        </div>
        {ch.isOff ? <Badge tone="gray">Off</Badge> : ch.bookingOpen ? <Badge tone="green">Booking open</Badge> : <Badge tone="red">Booking closed</Badge>}
      </div>

      {ch.slotTexts?.length ? (
        <ul className="mt-2 space-y-0.5 text-sm text-gray-700">
          {ch.slotTexts.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-sm text-gray-600">
        Fee {taka(ch.consultationFee)} · follow-up {taka(ch.followUpFee)} · {ch.limitPerSlot} serials per slot
      </p>

      {editing ? (
        <form
          className="mt-3 grid grid-cols-2 gap-2"
          onSubmit={form.handleSubmit((fees) =>
            save("fees", { consultationFee: Number(fees.consultationFee), followUpFee: Number(fees.followUpFee) }),
          )}
        >
          <Field label="Consultation fee" error={errorText(errors, "consultationFee")}>
            {(a) => <Input {...a} type="number" min="0" inputMode="numeric" {...form.register("consultationFee")} required />}
          </Field>
          <Field label="Follow-up fee" error={errorText(errors, "followUpFee")}>
            {(a) => <Input {...a} type="number" min="0" inputMode="numeric" {...form.register("followUpFee")} required />}
          </Field>
          <Button type="submit" loading={busy === "fees"}>
            Save fees
          </Button>
          <Button variant="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            className="min-h-11"
            variant={ch.bookingOpen ? "secondary" : "primary"}
            loading={busy === "booking"}
            onClick={() => save("booking", { bookingOpen: !ch.bookingOpen })}
          >
            {ch.bookingOpen ? "Close booking" : "Open booking"}
          </Button>
          <Button className="min-h-11" variant="secondary" onClick={() => setEditing(true)}>
            Edit fees
          </Button>
        </div>
      )}
      {ch.isOff ? <p className="mt-2 text-xs text-gray-500">An admin has marked this chamber off; patients can&apos;t book it.</p> : null}
    </Card>
  );
}

export default function DoctorChambersPage() {
  const queryClient = useQueryClient();
  const profile = useDoctorProfile();
  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", "doctor-profile"] });

  return (
    <>
      <PageHeader title="Chambers" subtitle="Where you see patients. Close booking when you can't sit." />
      {profile.isPending ? (
        <Loading />
      ) : profile.error ? (
        <ProfileError error={profile.error} onRetry={() => profile.refetch()} />
      ) : profile.data.chambers.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {profile.data.chambers.map((ch) => (
            <ChamberCard key={`${ch.id}-${ch.consultationFee}-${ch.followUpFee}`} ch={ch} onChanged={reload} />
          ))}
        </div>
      ) : (
        <Card>
          <Empty>No chambers yet. An admin adds the centres where you sit.</Empty>
        </Card>
      )}
    </>
  );
}
