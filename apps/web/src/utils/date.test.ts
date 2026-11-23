import { describe, expect, it } from "vitest";
import { parseLocalYMD, toLocalYMD } from "./date";

describe("parseLocalYMD", () => {
  it("reads a plain date as that day in local time", () => {
    const d = parseLocalYMD("2026-11-24");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 24]);
    expect(toLocalYMD(d)).toBe("2026-11-24");
  });

  it("uses the date part of an ISO timestamp", () => {
    expect(toLocalYMD(parseLocalYMD("2026-01-05T00:00:00.000Z"))).toBe("2026-01-05");
  });

  it("falls back to the Date parser for other strings", () => {
    expect(Number.isNaN(parseLocalYMD("not a date").getTime())).toBe(true);
  });
});
