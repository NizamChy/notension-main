import store from "@/redux/store";
import { handleUserReducer } from "@/redux/userReducer";
import { useSessionStore } from "./sessionStore";
import { useHealthStore } from "./healthStore";

/**
 * Signs out: clears the session, the account's patients and appointments, and
 * the account data still held in Redux.
 */
export function logout(): void {
  useSessionStore.getState().clearAccount();
  useHealthStore.getState().clear();
  store.dispatch(handleUserReducer({ type: "LOGOUT_USER" }));
}
