"use client";

// Doctor panel: serials at my chambers, today and later (or one date).
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlinePhone } from "react-icons/hi2";
import { adminApi } from "@/components/Admin/api";
import { AppointmentBadge, ProfileError } from "@/components/Admin/DoctorPanel";
import type { Appointment, AppointmentStatus } from "@/components/Admin/types";
import { Button, Card, ConfirmButton, cx, Empty, Input, Loading, PageHeader, Select } from "@/components/Admin/ui";
import { notify } from "@/utils/notify";
import { admin } from "@notension/shared";

const dayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const dayLabel = (ymd: string, today: string | undefined) => {
  const text = dayFmt.format(new Date(`${ymd}T00:00:00Z`));
  return ymd === today ? `Today · ${text}` : text;
};

function AppointmentCard({ a, onChanged }: { a: Appointment; onChanged: () => Promise<unknown> }) {
  const [busy, setBusy] = useState<AppointmentStatus | null>(null);
  const mark = async (status: AppointmentStatus) => {
    setBusy(status);
    try {
      const res = await adminApi(`/doctor/appointments/${a.id}`, { method: "PATCH", body: { status } });
      notify.success(res.message ?? "Done");
      await onChanged();
    } catch (err) {
      notify.error((err as Error).message);
    }
    setBusy(null);
  };
  const who = [a.patientAge != null ? `${a.patientAge} y` : null, a.patientGender || null].filter(Boolean).join(" · ");

  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="text-[10px] leading-none">Serial</span>
          <span className="text-lg font-bold leading-tight">{a.serialNo}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <p className="font-medium text-gray-900">{a.patientName}</p>
            <AppointmentBadge status={a.status} />
          </div>
          <p className="text-sm text-gray-600">{who || "—"}</p>
          <p className="text-xs text-gray-500">
            {a.timeSlot} · {a.centerName}
          </p>
          {a.patientPhone ? (
            <a href={`tel:${a.patientPhone}`} className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
              <HiOutlinePhone /> {a.patientPhone}
            </a>
          ) : null}
        </div>
      </div>
      {a.status !== "Cancelled" ? (
        <div className="mt-2 flex flex-wrap gap-2 pl-14">
          {a.status !== "Visited" ? (
            <Button size="sm" onClick={() => mark("Visited")} loading={busy === "Visited"} disabled={!!busy}>
              Completed
            </Button>
          ) : null}
          {a.status !== "No-show" ? (
            <Button size="sm" variant="secondary" onClick={() => mark("No-show")} loading={busy === "No-show"} disabled={!!busy}>
              No-show
            </Button>
          ) : null}
          <ConfirmButton
            label="Cancel"
            question="Cancel this serial?"
            confirmLabel="Yes, cancel"
            loading={busy === "Cancelled"}
            onConfirm={() => mark("Cancelled")}
          />
        </div>
      ) : null}
    </li>
  );
}

export default function DoctorAppointmentsPage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const list = useQuery({
    queryKey: ["admin", "doctor-appointments", date],
    queryFn: () => adminApi("/doctor/appointments", { query: { date }, result: admin.appointment.array() }),
    retry: false,
  });
  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", "doctor-appointments"] });
  const today = list.data?.today;
  const rows = (list.data?.result || []).filter((a) => !status || a.status === status);
  const days = [...new Set(rows.map((a) => a.date))];

  return (
    <>
      <PageHeader title="Appointments" subtitle="Serials at your chambers." />
      <Card className="mb-4 p-3">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Button
            variant={date === "" ? "primary" : "secondary"}
            onClick={() => setDate("")}
            className="sm:w-auto"
          >
            Today &amp; upcoming
          </Button>
          <Button
            variant={date && date === today ? "primary" : "secondary"}
            onClick={() => today && setDate(today)}
            className="sm:w-auto"
          >
            Today only
          </Button>
          <Input
            type="date"
            aria-label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cx("col-span-2 sm:w-44", date && date !== today ? "border-primary" : "")}
          />
          <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="col-span-2 sm:w-40">
            <option value="">All statuses</option>
            <option value="Booked">Booked</option>
            <option value="Visited">Completed</option>
            <option value="No-show">No-show</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </div>
      </Card>

      {list.isPending ? (
        <Loading />
      ) : list.error ? (
        <ProfileError error={list.error} onRetry={() => list.refetch()} />
      ) : days.length ? (
        <div className="space-y-4">
          {days.map((d) => {
            const dayRows = rows.filter((a) => a.date === d);
            const open = dayRows.filter((a) => a.status === "Booked").length;
            return (
              <Card key={d} className="p-3 md:p-4">
                <h2 className="flex items-center justify-between font-semibold text-gray-900">
                  <span>{dayLabel(d, today)}</span>
                  <span className="text-xs font-normal text-gray-500">
                    {dayRows.length} serial{dayRows.length === 1 ? "" : "s"} · {open} waiting
                  </span>
                </h2>
                <ul className="divide-y divide-gray-100">
                  {dayRows.map((a) => (
                    <AppointmentCard key={a.id} a={a} onChanged={reload} />
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <Empty>{date ? "No appointments on this date." : "No appointments today or coming up."}</Empty>
        </Card>
      )}
    </>
  );
}
