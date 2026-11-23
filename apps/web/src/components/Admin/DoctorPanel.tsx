"use client";

// Shared bits of the doctor panel (appointments, chambers, profile pages).
import { useQuery } from "@tanstack/react-query";
import { adminApi, statusOf } from "./api";
import type { AppointmentStatus, DoctorProfile } from "./types";
import { Badge, Card, ErrorBox, type Tone } from "./ui";

export const useDoctorProfile = () =>
  useQuery({
    queryKey: ["admin", "doctor-profile"],
    queryFn: () => adminApi<DoctorProfile>("/doctor/profile").then((r) => r.result),
    retry: false,
  });

// "Visited" is stored for back-compat with the customer app; doctors see "Completed".
export const APPOINTMENT_LABEL: Record<AppointmentStatus, string> = {
  Booked: "Booked",
  Visited: "Completed",
  Cancelled: "Cancelled",
  "No-show": "No-show",
};
const APPOINTMENT_TONE: Record<AppointmentStatus, Tone> = { Booked: "blue", Visited: "green", Cancelled: "red", "No-show": "amber" };

export const AppointmentBadge = ({ status }: { status: AppointmentStatus }) => (
  <Badge tone={APPOINTMENT_TONE[status] || "gray"}>{APPOINTMENT_LABEL[status] || status}</Badge>
);

// Shown when the API can't find a doctor profile for this login.
export function ProfileError({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  if (statusOf(error) === 404) {
    return (
      <Card>
        <p className="font-medium text-gray-900">Your doctor profile isn&apos;t linked yet</p>
        <p className="mt-1 text-sm text-gray-600">
          Ask a NoTension admin to link your doctor profile to this account. Then your chambers and appointments show up here.
        </p>
      </Card>
    );
  }
  return <ErrorBox error={error} onRetry={onRetry} />;
}
