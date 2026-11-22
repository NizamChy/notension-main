import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ContractError, resetWarnedEndpoints, validate } from "./validate";

const schema = z.object({ id: z.string() });

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  resetWarnedEndpoints();
});

describe("validate", () => {
  it("strict mode throws ContractError on a live mismatch", () => {
    try {
      validate(schema, { id: 1 }, { source: "live", endpoint: "GET /a" });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ContractError);
      const e = error as ContractError;
      expect(e.endpoint).toBe("GET /a");
      expect(e.issues.length).toBeGreaterThan(0);
      expect(e.message).toContain("GET /a");
    }
  });

  it("returns parsed data when the shape matches", () => {
    expect(validate(schema, { id: "x" }, { source: "live", endpoint: "GET /ok" })).toEqual({ id: "x" });
  });

  it("demo answers never throw", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const data = { id: 1 };
    expect(validate(schema, data, { source: "demo", endpoint: "GET /d" })).toBe(data);
    validate(schema, data, { source: "demo", endpoint: "GET /d" });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("production never throws", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const data = { id: 1 };
    expect(validate(schema, data, { source: "live", endpoint: "GET /p" })).toBe(data);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
