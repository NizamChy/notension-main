import { useId, type ReactNode } from "react";

export type FormFieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

// A label, the input (render prop, spread the props onto it) and the error
// text beside it. Colours are the shared UI tokens (red #D92D20, gray-* flips
// in dark mode).
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: (props: FormFieldControlProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children({
        id,
        "aria-describedby": error ? errorId : undefined,
        "aria-invalid": error ? true : undefined,
      })}
      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-sm text-[#D92D20]">
          {error}
        </span>
      )}
    </div>
  );
}
