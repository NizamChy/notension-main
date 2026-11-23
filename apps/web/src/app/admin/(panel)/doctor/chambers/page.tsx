"use client";

// Doctor panel: my chambers. Open or close booking, and set the fees.
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminApi, taka } from "@/components/Admin/api";
import { ProfileError, useDoctorProfile } from "@/components/Admin/DoctorPanel";
import type { Chamber } from "@/components/Admin/types";
import { Badge, Button, Card, Empty, Field, Input, Loading, PageHeader } from "@/components/Admin/ui";
import { notify } from "@/utils/notify";

function ChamberCard({ ch, onChanged }: { ch: Chamber; onChanged: () => Promise<unknown> }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  // Numbers from the API; strings once edited in the inputs.
  const [fees, setFees] = useState<{ consultationFee: number | string; followUpFee: number | string }>({
    consultationFee: ch.consultationFee,
    followUpFee: ch.followUpFee,
  });

  const save = async (key: string, body: Record<string, unknown>) => {
    setBusy(key);
    try {
      const res = await adminApi(`/doctor/chambers/${ch.id}`, { method: "PATCH", body });
      notify.success(res.message);
      setEditing(false);
      await onChanged();
    } catch (err) {
      notify.error((err as Error).message);
    }
    setBusy(null);
  };

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
          onSubmit={(e) => {
            e.preventDefault();
            save("fees", { consultationFee: Number(fees.consultationFee), followUpFee: Number(fees.followUpFee) });
          }}
        >
          <Field label="Consultation fee">
            <Input type="number" min="0" inputMode="numeric" value={fees.consultationFee} onChange={(e) => setFees({ ...fees, consultationFee: e.target.value })} required />
          </Field>
          <Field label="Follow-up fee">
            <Input type="number" min="0" inputMode="numeric" value={fees.followUpFee} onChange={(e) => setFees({ ...fees, followUpFee: e.target.value })} required />
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
