import toast, {
  type DefaultToastOptions,
  type Renderable,
  type Toast,
  type ToastOptions,
  type ValueOrFunction,
} from "react-hot-toast";
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

type ToastMessage = ValueOrFunction<Renderable, Toast>;

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

const accent = (kind: keyof typeof TOAST_ACCENT) => ({
  borderLeft: `4px solid ${TOAST_ACCENT[kind]}`,
});

const ALERT: Toast["ariaProps"] = { role: "alert", "aria-live": "assertive" };

// The same text firing twice updates one toast instead of stacking two.
const idFor = (kind: string, message: ToastMessage, options?: ToastOptions) =>
  options?.id ?? (typeof message === "string" ? `${kind}:${message}` : undefined);

const withDefaults = (
  kind: string,
  message: ToastMessage,
  options: ToastOptions = {},
) => ({
  ...options,
  id: idFor(kind, message, options),
});

const OtpMessage = ({ code }: { code: string | number }) => (
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
  success: (message: ToastMessage, options?: ToastOptions) =>
    toast.success(message, withDefaults("success", message, options)),

  error: (message: ToastMessage = GENERIC_ERROR, options?: ToastOptions) =>
    toast.error(message, {
      ariaProps: ALERT,
      ...withDefaults("error", message, options),
    }),

  info: (message: ToastMessage, options?: ToastOptions) =>
    toast(message, {
      icon: <HiInformationCircle size={22} color={TOAST_ACCENT.info} />,
      duration: TOAST_DURATION.info,
      ...withDefaults("info", message, options),
      style: { ...accent("info"), ...options?.style },
    }),

  warning: (message: ToastMessage, options?: ToastOptions) =>
    toast(message, {
      icon: <HiExclamationTriangle size={22} color={TOAST_ACCENT.warning} />,
      duration: TOAST_DURATION.warning,
      ariaProps: ALERT,
      ...withDefaults("warning", message, options),
      style: { ...accent("warning"), ...options?.style },
    }),

  loading: (message: ToastMessage, options?: ToastOptions) =>
    toast.loading(message, withDefaults("loading", message, options)),

  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    messages?: {
      loading?: Renderable;
      success?: ValueOrFunction<Renderable, T>;
      error?: ValueOrFunction<Renderable, unknown>;
    },
    options?: DefaultToastOptions,
  ) =>
    toast.promise(
      promise,
      {
        loading: messages?.loading ?? "Please wait…",
        success: messages?.success ?? "Done",
        error: messages?.error ?? ((error: unknown) => errorMessage(error)),
      },
      options
    ),

  // Shown when the API returns the code itself (no SMS provider yet).
  otp: (code: string | number) =>
    toast(<OtpMessage code={code} />, {
      id: "otp",
      icon: <HiKey size={22} color={TOAST_ACCENT.info} />,
      duration: TOAST_DURATION.otp,
      style: accent("info"),
    }),

  dismiss: (id?: string) => toast.dismiss(id),
};

export default notify;
