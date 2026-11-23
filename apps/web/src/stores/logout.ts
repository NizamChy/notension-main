import { useSessionStore } from "./sessionStore";
import { useHealthStore } from "./healthStore";

/**
 * Signs out: clears the session and the account's patients and appointments.
 */
export function logout(): void {
  useSessionStore.getState().clearAccount();
  useHealthStore.getState().clear();
}
