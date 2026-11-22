import store from "@/redux/store";
import { handleUserReducer } from "@/redux/userReducer";
import { useSessionStore } from "./sessionStore";

/** Signs out: clears the session store and the account data still held in Redux. */
export function logout(): void {
  useSessionStore.getState().clearAccount();
  store.dispatch(handleUserReducer({ type: "LOGOUT_USER" }));
}
