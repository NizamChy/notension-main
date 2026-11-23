import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  bookAppointment,
  getPatients,
  registerPatient,
  type BookAppointmentResult,
} from "@/lib/api/healthCare";
import { queryKeys } from "@/lib/api/queryKeys";
import { useHealthStore, type HealthRecord } from "@/stores/healthStore";
import { useSessionStore } from "@/stores/sessionStore";
import notify, { GENERIC_ERROR, friendlyMessage } from "@/utils/notify";

/**
 * The account's patients. The saved list shows at once; the server's list
 * replaces it when it has any (the demo backend forgets patients on reload,
 * so an empty answer keeps the saved ones), as the old usePatient did.
 */
export function usePatients() {
  const userInfo = useSessionStore((s) => s.userInfo);
  const userId = typeof userInfo._id === "string" ? userInfo._id : "";
  const patients = useHealthStore((s) => s.patients);
  const [progressing, setProgressing] = useState(false);
  const inFlight = useRef(false);

  const query = useQuery({
    queryKey: queryKeys.healthCare.patients(userId),
    queryFn: () => getPatients(userInfo),
    enabled: !!userId,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) useHealthStore.getState().setPatients(query.data);
  }, [query.data]);

  /** Registers a patient; resolves to true when it was saved. */
  const register = (form: Record<string, unknown>): Promise<boolean> => {
    // Ignore repeat clicks while the request is still in flight.
    if (inFlight.current) return Promise.resolve(false);
    inFlight.current = true;
    setProgressing(true);
    return registerPatient(form, userInfo)
      .then((res) => {
        if (res?.success) notify.success(friendlyMessage(res.message, "Patient added"));
        if (res?.result) useHealthStore.getState().savePatient(res.result);
        return Boolean(res?.success);
      })
      .catch(() => false)
      .finally(() => {
        inFlight.current = false;
        setProgressing(false);
      });
  };

  return { patients, isLoading: query.isLoading, progressing, register };
}

/** What the booking form sends: the API fields plus what the list shows. */
export type AppointmentRequest = Record<string, unknown> & {
  doctor_name?: unknown;
  doctor_speciality?: unknown;
  consultation_center_name?: unknown;
  appointment_day?: unknown;
};

const DISPLAY_ONLY = ["doctor_name", "doctor_speciality", "consultation_center_name", "appointment_day"];

/** Books an appointment (same flow as the old useAppointment). */
export function useBookAppointment() {
  const router = useRouter();
  const userInfo = useSessionStore((s) => s.userInfo);
  const [progressing, setProgressing] = useState(false);
  const inFlight = useRef(false);

  /** Resolves to true when the appointment was booked. */
  const book = (request: AppointmentRequest): Promise<boolean> => {
    // Ignore repeat clicks while the request is still in flight.
    if (inFlight.current) return Promise.resolve(false);
    inFlight.current = true;
    setProgressing(true);
    // The display-only fields stay on the device.
    const body = Object.fromEntries(
      Object.entries(request).filter(([key]) => !DISPLAY_ONLY.includes(key)),
    );

    return bookAppointment(body, userInfo)
      .then((res: BookAppointmentResult) => {
        if (res.success) {
          notify.success(friendlyMessage(res.message, "Appointment booked"));
          useHealthStore.getState().addAppointment({ ...res.result, ...request } as HealthRecord);
          router.push("/medical-services/doctor/booked-appointment");
          return true;
        }
        notify.info(
          friendlyMessage(res.message, "We couldn't book this appointment. Please try another time slot."),
        );
        return false;
      })
      .catch(() => {
        notify.error(GENERIC_ERROR);
        return false;
      })
      .finally(() => {
        inFlight.current = false;
        setProgressing(false);
      });
  };

  return { progressing, book };
}
