// Admin form schemas built from the API's own field schemas (the shared
// admin contract), so a form rejects what the API would reject, with the
// API's message. Inputs hold strings; each check runs on the value the
// API will get.
import { z } from "zod";
import { admin } from "@notension/shared";
import type { FieldErrors, FieldValues } from "react-hook-form";

// Input string -> API value.
export const asText = (v: string) => v.trim();
export const asNumber = (v: string) => (v.trim() === "" ? 0 : Number(v));
export const asNullable = (v: string) => (v.trim() === "" ? null : v.trim());

/**
 * A string input checked by `api` (the API's schema for the field) on
 * `toApi(value)`. With `unchanged`, that value is not checked: the API only
 * sees the fields that changed.
 */
export const apiChecked = (api: z.ZodType, toApi: (v: string) => unknown = asText, unchanged?: string) =>
  z.string().superRefine((v, ctx) => {
    if (unchanged !== undefined && v === unchanged) return;
    const r = api.safeParse(toApi(v));
    if (!r.success) ctx.addIssue({ code: "custom", message: r.error.issues[0]?.message ?? "Invalid value" });
  });

/** The message of a field's error, for <Field error>. */
export const errorText = <T extends FieldValues>(errors: FieldErrors<T>, name: string): string | undefined => {
  const message = (errors as Record<string, { message?: unknown } | undefined>)[name]?.message;
  return typeof message === "string" ? message : undefined;
};

// POST /roles name input: sent trimmed, and left out when empty.
export const roleName = apiChecked(admin.roleInput.shape.name, (v) => v.trim() || undefined);

// Setup link: the new password (the API's rule) typed twice.
export const setupForm = z
  .object({ password: admin.setupInput.shape.password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "The two passwords don't match." });

// Account: the current password and the new one (the API's rules) typed twice.
export const passwordForm = z
  .object({ current: admin.passwordInput.shape.current, next: admin.passwordInput.shape.next, confirm: z.string() })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "The two new passwords don't match." });
