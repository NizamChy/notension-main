"use client";

// Small building blocks for the admin panel.
import { useState } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import Link from "next/link";
import { roleLabel } from "./api";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "danger" | "ghost";

const BTN: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-secondary disabled:opacity-60",
  secondary: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-60",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60",
  ghost: "text-gray-700 hover:bg-gray-100 disabled:opacity-60",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md";
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", className, loading, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={props.disabled || loading}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed",
        // Phones get finger-sized targets; desktop keeps the compact size.
        size === "sm" ? "min-h-9 px-3 py-1.5 text-xs md:min-h-0 md:px-2.5 md:py-1" : "min-h-10 px-4 py-2 text-sm",
        BTN[variant],
        className,
      )}
    >
      {loading ? <Spinner small /> : null}
      {children}
    </button>
  );
}

type ButtonLinkProps = { href: string; variant?: Variant; className?: string; children: ReactNode };

export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cx("inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium", BTN[variant], className)}
    >
      {children}
    </Link>
  );
}

export const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cx(inputClass, className)} />
);

export const Select = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={cx(inputClass, className)}>
    {children}
  </select>
);

type FieldProps = { label: ReactNode; hint?: ReactNode; children: ReactNode; className?: string };

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-gray-500">{hint}</span> : null}
    </label>
  );
}

type CheckboxProps = {
  label: ReactNode;
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ label, checked, onChange, disabled }: CheckboxProps) {
  return (
    <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm text-gray-800 md:min-h-0">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[#0c3f8e]"
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

export const Card = ({ className, children }: { className?: string; children?: ReactNode }) => (
  // min-w-0: inside a grid, a wide table scrolls within the card instead of
  // stretching the page on phones.
  <div className={cx("min-w-0 rounded-xl border border-gray-200 bg-white p-4 md:p-5", className)}>{children}</div>
);

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: ReactNode };
};

export function PageHeader({ title, subtitle, actions, back }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="mb-1 inline-block py-1.5 text-sm text-primary hover:underline md:py-0">
            ← {back.label}
          </Link>
        ) : null}
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export const Spinner = ({ small }: { small?: boolean }) => (
  <span
    aria-hidden="true"
    className={cx(
      "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
      small ? "h-3.5 w-3.5" : "h-6 w-6 text-primary",
    )}
  />
);

export const Loading = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex items-center gap-3 py-10 text-sm text-gray-500">
    <Spinner /> {label}
  </div>
);

// An Error (ApiError, a failed query) or a plain message.
export type ErrorLike = { message: string } | string | null | undefined;

export function ErrorBox({ error, onRetry }: { error: ErrorLike; onRetry?: () => void }) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;
  return (
    <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      <span>{message}</span>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="font-medium underline">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function Notice({ children, tone = "success" }: { children?: ReactNode; tone?: "success" | "warning" }) {
  if (!children) return null;
  return (
    <div
      role="status"
      className={cx(
        "mb-4 rounded-lg border px-3 py-2 text-sm",
        tone === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      {children}
    </div>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="py-8 text-center text-sm text-gray-500">{children}</p>;

export type Tone = "gray" | "blue" | "green" | "amber" | "red" | "purple";

const BADGE: Record<Tone, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  purple: "bg-purple-100 text-purple-800",
};

export const Badge = ({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) => (
  <span className={cx("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", BADGE[tone])}>
    {children}
  </span>
);

const STATUS_TONE: Record<string, Tone> = {
  Pending: "amber",
  Accepted: "blue",
  Processing: "purple",
  "On the way": "blue",
  Delivered: "green",
  Cancelled: "red",
};
export const StatusBadge = ({ status }: { status: string }) => <Badge tone={STATUS_TONE[status] || "gray"}>{status}</Badge>;

type RoleLike = { role: string; storeId?: string | null; storeName?: string | null };

export function RoleBadge({ role }: { role: RoleLike }) {
  const tone: Tone = role.role === "super_admin" || role.role === "admin" ? "purple" : role.storeId ? "blue" : "gray";
  return (
    <Badge tone={tone}>
      {roleLabel(role.role)}
      {role.storeName ? ` · ${role.storeName}` : ""}
    </Badge>
  );
}

type PaginationProps = { page: number; total?: number; pageSize?: number; onPage: (page: number) => void };

export function Pagination({ page, total, pageSize, onPage }: PaginationProps) {
  const pages = Math.max(1, Math.ceil((total || 0) / (pageSize || 25)));
  if (pages <= 1) return total ? <p className="mt-3 text-xs text-gray-500">{total} total</p> : null;
  return (
    <div className="mt-4 flex items-center justify-between gap-2 text-sm">
      <span className="text-gray-500">
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

// An action that needs a second click to confirm (no window.confirm).
type ConfirmButtonProps = {
  label: ReactNode;
  confirmLabel?: ReactNode;
  question?: ReactNode;
  onConfirm: () => unknown;
  variant?: Variant;
  size?: "sm" | "md";
  loading?: boolean;
};

export function ConfirmButton({
  label,
  confirmLabel = "Yes, do it",
  question = "Are you sure?",
  onConfirm,
  variant = "danger",
  size = "sm",
  loading,
}: ConfirmButtonProps) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <Button variant={variant === "danger" ? "secondary" : variant} size={size} onClick={() => setAsking(true)} loading={loading}>
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-xs text-gray-700">
      <span>{question}</span>
      <Button
        variant={variant}
        size="sm"
        onClick={async () => {
          setAsking(false);
          await onConfirm();
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  );
}

// A one-time setup link with a copy button and what to do with it.
export function SetupLinkBox({ link, onClose }: { link: string | null | undefined; onClose?: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!link) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
      <p className="font-medium">Setup link ready</p>
      <p className="mt-0.5 text-green-800">
        Send this link to them (SMS, WhatsApp). They open it and choose their password. It works once, for 7 days.
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input readOnly value={link} onFocus={(e) => e.target.select()} className={cx(inputClass, "font-mono text-xs")} />
        <div className="flex gap-2">
          <Button onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
          {onClose ? (
            <Button variant="secondary" onClick={onClose}>
              Done
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto md:mx-0">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

export const Td = ({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...props} className={cx("px-3 py-2.5 align-top text-gray-800", className)}>
    {children}
  </td>
);
