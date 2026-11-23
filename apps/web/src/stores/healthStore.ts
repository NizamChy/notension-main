import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readLegacyRoot } from "./legacy";
import { legacyAwareStorage } from "./storage";

// The account's patients and booked appointments. They are kept on the device:
// the API has no appointment list, and the demo backend forgets patients on
// reload. Cleared on logout and on the sample/live switch.

/** A saved record: the API's patient or appointment plus what the page showed. */
export type HealthRecord = { _id: string; [field: string]: unknown };

export type HealthState = {
  patients: HealthRecord[];
  appointments: HealthRecord[];
};

type HealthActions = {
  /** Replaces the patient list (the server's copy). */
  setPatients: (list: HealthRecord[]) => void;
  /** Adds a patient, or replaces the one with the same id. */
  savePatient: (patient: HealthRecord) => void;
  removePatient: (id: string) => void;
  addAppointment: (appointment: HealthRecord) => void;
  /** Drops appointments dated before `today` (YYYY-MM-DD, local). */
  prunePastAppointments: (today: string) => void;
  clear: () => void;
};

export const initialHealthState: HealthState = { patients: [], appointments: [] };

const isRecord = (v: unknown): v is HealthRecord =>
  !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as { _id?: unknown })._id === "string";

const records = (v: unknown): HealthRecord[] => (Array.isArray(v) ? v.filter(isRecord) : []);

/** Builds the store state from the old Redux `user.patientInfo` / `user.bookedAppoinmentInfo`. */
export function healthFromLegacy(s: Pick<Storage, "getItem">): HealthState | null {
  const user = readLegacyRoot(s)?.user;
  if (!user) return null;
  const patients = records(user.patientInfo);
  const appointments = records(user.bookedAppoinmentInfo);
  return patients.length || appointments.length ? { patients, appointments } : null;
}

/** An appointment's date as YYYY-MM-DD (the API sends a plain date). */
const dayOf = (a: HealthRecord) => String(a.appointment_date ?? "").slice(0, 10);

export const useHealthStore = create<HealthState & HealthActions>()(
  persist(
    (set, get) => ({
      ...initialHealthState,
      setPatients: (list) => set({ patients: records(list) }),
      savePatient: (patient) => {
        if (!isRecord(patient)) return;
        const { patients } = get();
        const known = patients.some((p) => p._id === patient._id);
        set({
          patients: known
            ? patients.map((p) => (p._id === patient._id ? patient : p))
            : [...patients, patient],
        });
      },
      removePatient: (id) => set({ patients: get().patients.filter((p) => p._id !== id) }),
      addAppointment: (appointment) => {
        if (!isRecord(appointment)) return;
        set({ appointments: [...get().appointments, appointment] });
      },
      prunePastAppointments: (today) => {
        const kept = get().appointments.filter((a) => dayOf(a) >= today);
        if (kept.length !== get().appointments.length) set({ appointments: kept });
      },
      clear: () => set(initialHealthState),
    }),
    {
      name: "notension-health",
      version: 1,
      skipHydration: true,
      storage: legacyAwareStorage<HealthState>("notension-health", 1, healthFromLegacy),
      partialize: (s): HealthState => ({ patients: s.patients, appointments: s.appointments }),
    },
  ),
);
