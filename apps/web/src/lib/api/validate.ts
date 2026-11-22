import type { z } from "zod";

export type Source = "live" | "demo";

export class ContractError extends Error {
  readonly endpoint: string;
  readonly issues: z.core.$ZodIssue[];

  constructor(endpoint: string, issues: z.core.$ZodIssue[]) {
    const summary = issues
      .slice(0, 5)
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    super(`Response from ${endpoint} broke its contract: ${summary}`);
    this.name = "ContractError";
    this.endpoint = endpoint;
    this.issues = issues;
  }
}

const warned = new Set<string>();

/** Test helper: forget which endpoints were already warned about. */
export const resetWarnedEndpoints = () => warned.clear();

type Context = { source: Source; endpoint: string; mode?: "strict" | "warn" };

/**
 * Checks `data` against `schema`. Strict (throws ContractError) only for real
 * API answers outside production; otherwise warns once per endpoint. Always
 * returns the original `data` (a check, not a transform); in warn mode that
 * value is unvalidated.
 */
export function validate<S extends z.ZodType>(schema: S, data: unknown, ctx: Context): z.infer<S> {
  const mode = ctx.mode ?? (process.env.NODE_ENV !== "production" && ctx.source === "live" ? "strict" : "warn");
  const result = schema.safeParse(data);
  if (result.success) return data as z.infer<S>;

  if (mode === "strict") throw new ContractError(ctx.endpoint, result.error.issues);

  if (!warned.has(ctx.endpoint)) {
    warned.add(ctx.endpoint);
    console.warn(`[contract] ${ctx.endpoint} (${ctx.source}) does not match its schema`, result.error.issues);
  }
  return data as z.infer<S>;
}
