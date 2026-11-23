import { beforeEach, describe, expect, it, vi } from "vitest";
import { hydrateStores } from "./hydrate";
import { resetForSampleSwitch } from "./resetForSampleSwitch";
import { legacyAwareStorage } from "./storage";
import { healthFromLegacy, useHealthStore, type HealthState } from "./healthStore";

import { logout } from "./logout";

function fakeStorage(seed: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(seed));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, String(v)),
  };
}

const patient = (id: string, name = `Patient ${id}`) => ({ _id: id, patient_name: name });
const appointment = (id: string, date: string) => ({ _id: id, appointment_date: date });

const legacyRoot = (user: unknown) =>
  JSON.stringify({ user: JSON.stringify(user), _persist: JSON.stringify({ version: 1 }) });

const useStorage = (fake: Storage) =>
  useHealthStore.persist.setOptions({
    storage: legacyAwareStorage<HealthState>("notension-health", 1, healthFromLegacy, fake),
  });

beforeEach(() => {
  useStorage(fakeStorage());
  useHealthStore.getState().clear();
});

describe("health store", () => {
  it("adds, updates and removes patients", () => {
    const { savePatient, removePatient } = useHealthStore.getState();
    savePatient(patient("a"));
    savePatient(patient("b"));
    savePatient(patient("a", "Renamed"));
    expect(useHealthStore.getState().patients.map((p) => p.patient_name)).toEqual(["Renamed", "Patient b"]);
    removePatient("a");
    expect(useHealthStore.getState().patients.map((p) => p._id)).toEqual(["b"]);
  });

  it("drops appointments before today", () => {
    const { addAppointment, prunePastAppointments } = useHealthStore.getState();
    addAppointment(appointment("old", "2026-11-22"));
    addAppointment(appointment("today", "2026-11-23"));
    addAppointment(appointment("later", "2026-11-30"));
    prunePastAppointments("2026-11-23");
    expect(useHealthStore.getState().appointments.map((a) => a._id)).toEqual(["today", "later"]);
  });

  it("migrates the Redux patients and appointments once", async () => {
    const fake = fakeStorage({
      "persist:root": legacyRoot({
        patientInfo: [patient("p1"), null],
        bookedAppoinmentInfo: [appointment("a1", "2026-12-01")],
      }),
    });
    useStorage(fake);

    await hydrateStores();

    expect(useHealthStore.getState().patients.map((p) => p._id)).toEqual(["p1"]);
    expect(useHealthStore.getState().appointments.map((a) => a._id)).toEqual(["a1"]);
    expect(JSON.parse(fake.getItem("notension-health") ?? "null").state.patients).toHaveLength(1);
  });

  it("ignores a missing or empty legacy user", () => {
    const reader = (root: string | null) => ({ getItem: (k: string) => (k === "persist:root" ? root : null) });
    expect(healthFromLegacy(reader(null))).toBeNull();
    expect(healthFromLegacy(reader(legacyRoot({ patientInfo: [] })))).toBeNull();
  });

  it("is cleared on logout and on the sample/live switch", () => {
    useHealthStore.getState().savePatient(patient("a"));
    logout();
    expect(useHealthStore.getState().patients).toEqual([]);

    useHealthStore.getState().addAppointment(appointment("x", "2026-12-01"));
    resetForSampleSwitch();
    expect(useHealthStore.getState().appointments).toEqual([]);
  });
});
