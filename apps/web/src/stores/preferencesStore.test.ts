import { describe, expect, it } from "vitest";
import { preferencesFromLegacy } from "./preferencesStore";

const reader = (root: unknown): Pick<Storage, "getItem"> => ({
  getItem: (k) => (k === "persist:root" ? JSON.stringify(root) : null),
});

describe("preferencesFromLegacy", () => {
  it("migrates currentModule from persist:root", () => {
    const s = reader({ dashboard: JSON.stringify({ currentModule: "Food" }) });
    expect(preferencesFromLegacy(s)).toEqual({ currentModule: "Food" });
  });

  it("ignores a broken dashboard slice", () => {
    expect(preferencesFromLegacy(reader({ dashboard: "{not json" }))).toBeNull();
    expect(preferencesFromLegacy(reader({ dashboard: JSON.stringify([1]) }))).toBeNull();
    expect(
      preferencesFromLegacy(reader({ dashboard: JSON.stringify({ currentModule: 5 }) })),
    ).toBeNull();
    expect(preferencesFromLegacy(reader({}))).toBeNull();
  });
});
