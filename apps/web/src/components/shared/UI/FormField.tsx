import type { ReactNode } from "react";

// A label, the input passed as children, and the error text under it.
// Colours are the shared UI tokens (red #D92D20, gray-* flips in dark mode).
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-[#D92D20]">
          {error}
        </span>
      )}
    </label>
  );
}
