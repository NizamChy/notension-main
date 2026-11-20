import toast from "react-hot-toast";
import {
  HiExclamationTriangle,
  HiInformationCircle,
  HiKey,
} from "react-icons/hi2";
import { GENERIC_ERROR, errorMessage } from "./toastMessages";

export {
  GENERIC_ERROR,
  errorMessage,
  friendlyMessage,
} from "./toastMessages";

// One place for every toast on the site. The look (card, colours, icons,
// close button, stack limit) lives in components/shared/Toast/AppToaster.

// How long each kind of toast stays up (ms). Errors stay longer so they can
// be read; loading stays until it is updated or dismissed.
export const TOAST_DURATION = {
  success: 3000,
  error: 5000,
  info: 4000,
  warning: 5000,
  otp: 15000,
};

export const TOAST_ACCENT = {
  success: "#16a34a",
  error: "#dc2626",
  info: "#0c3f8e",
  warning: "#d97706",
  loading: "#0c3f8e",
};

const accent = (kind) => ({ borderLeft: `4px solid ${TOAST_ACCENT[kind]}` });

const ALERT = { role: "alert", "aria-live": "assertive" };

// The same text firing twice updates one toast instead of stacking two.
const idFor = (kind, message, options) =>
  options?.id ?? (typeof message === "string" ? `${kind}:${message}` : undefined);

const withDefaults = (kind, message, options = {}) => ({
  ...options,
  id: idFor(kind, message, options),
});

const OtpMessage = ({ code }) => (
  <div className="min-w-0">
    <p className="text-sm font-semibold text-gray-900">
      Your verification code
    </p>
    <p
      className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-primary dark:text-[#7FB2FF]"
      aria-label={`Code ${String(code).split("").join(" ")}`}
    >
      {code}
    </p>
    <p className="mt-1 text-xs leading-snug text-gray-500">
      SMS isn&apos;t available yet, so we&apos;re showing your code here.
    </p>
  </div>
);

export const notify = {
  success: (message, options) =>
    toast.success(message, withDefaults("success", message, options)),

  error: (message = GENERIC_ERROR, options) =>
    toast.error(message, {
      ariaProps: ALERT,
      ...withDefaults("error", message, options),
    }),

  info: (message, options) =>
    toast(message, {
      icon: <HiInformationCircle size={22} color={TOAST_ACCENT.info} />,
      duration: TOAST_DURATION.info,
      ...withDefaults("info", message, options),
      style: { ...accent("info"), ...options?.style },
    }),

  warning: (message, options) =>
    toast(message, {
      icon: <HiExclamationTriangle size={22} color={TOAST_ACCENT.warning} />,
      duration: TOAST_DURATION.warning,
      ariaProps: ALERT,
      ...withDefaults("warning", message, options),
      style: { ...accent("warning"), ...options?.style },
    }),

  loading: (message, options) =>
    toast.loading(message, withDefaults("loading", message, options)),

  promise: (promise, messages, options) =>
    toast.promise(
      promise,
      {
        loading: messages?.loading ?? "Please wait…",
        success: messages?.success ?? "Done",
        error: messages?.error ?? ((error) => errorMessage(error)),
      },
      options
    ),

  // Shown when the API returns the code itself (no SMS provider yet).
  otp: (code) =>
    toast(<OtpMessage code={code} />, {
      id: "otp",
      icon: <HiKey size={22} color={TOAST_ACCENT.info} />,
      duration: TOAST_DURATION.otp,
      style: accent("info"),
    }),

  dismiss: (id) => toast.dismiss(id),
};

export default notify;
