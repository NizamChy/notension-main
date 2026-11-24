// @vitest-environment jsdom
// The admin panel's contract checks and its forms' validation (the API's
// own field schemas, from packages/shared/src/contract/admin.ts).
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { admin } from "@notension/shared";
import { ContractError, resetWarnedEndpoints } from "@/lib/api/validate";
import { useZodForm } from "@/lib/forms/useZodForm";
import { adminApi } from "./api";
import { MERCHANT_FIELDS, StoreFields, storeFormSchema, toForm, type StoreForm } from "./StoreFields";
import type { Store } from "./types";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  resetWarnedEndpoints();
});

// GET /api/v1/admin/me for the demo store owner, as the API sends it.
const ME_SAMPLE = {
  success: true,
  result: {
    id: "dea000000000001700000006",
    name: "Demo Store Owner",
    phone: "01700000006",
    roles: [{ role: "merchant_owner", storeId: "6650a00100000000000000a1", storeName: "Demo Grocery", module: "grocery" }],
  },
};

const answer = (body: unknown, status = 200) =>
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })));

describe("adminApi", () => {
  test("returns an answer that matches its contract", async () => {
    answer(ME_SAMPLE);
    const res = await adminApi("/me", { result: admin.me });
    expect(res.result.roles[0]?.storeName).toBe("Demo Grocery");
  });

  test("flags an answer that breaks its contract (strict outside production)", async () => {
    answer({ success: true, result: { ...ME_SAMPLE.result, roles: [{ role: "pilot" }] } });
    await expect(adminApi("/me", { result: admin.me })).rejects.toBeInstanceOf(ContractError);
  });

  test("still throws the API's message for errors", async () => {
    answer({ success: false, message: "Store not found" }, 404);
    await expect(adminApi("/stores/x", { result: admin.storeDetail })).rejects.toThrow("Store not found");
  });
});

const STORE: Partial<Store> = { isClosed: false, opensAt: "09:00 AM", closesAt: null, minOrder: 0, discountType: "percent" };

function SettingsHarness({ onSave }: { onSave: (values: StoreForm) => void }) {
  const initial = toForm(MERCHANT_FIELDS, STORE);
  const form = useZodForm(storeFormSchema(MERCHANT_FIELDS, initial), { defaultValues: initial });
  return (
    <form onSubmit={form.handleSubmit(onSave)}>
      <StoreFields fields={MERCHANT_FIELDS} form={form} />
      <button type="submit">Save</button>
    </form>
  );
}

describe("store settings form", () => {
  test("shows the API's message inline for an invalid value and does not submit", async () => {
    const onSave = vi.fn();
    render(<SettingsHarness onSave={onSave} />);
    const opens = screen.getByLabelText(/^Opens at/);
    fireEvent.change(opens, { target: { value: "25:00" } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(screen.getByText("Use a time like 09:00 AM or 21:30")).toBeTruthy());
    expect(opens.getAttribute("aria-invalid")).toBe("true");
    expect(opens.getAttribute("aria-describedby")).toBe(screen.getByRole("alert").getAttribute("id"));
    expect(onSave).not.toHaveBeenCalled();
  });

  test("submits valid changes", async () => {
    const onSave = vi.fn();
    render(<SettingsHarness onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/^Opens at/), { target: { value: "8:30 pm" } });
    fireEvent.change(screen.getByLabelText(/^Minimum order \(/), { target: { value: "150" } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0]?.[0]).toMatchObject({ opensAt: "8:30 pm", minOrder: "150" });
  });

  test("uses the API's limits for money fields", () => {
    const schema = storeFormSchema(MERCHANT_FIELDS, toForm(MERCHANT_FIELDS, STORE));
    const values = { ...toForm(MERCHANT_FIELDS, STORE), minOrder: "-5" };
    const r = schema.safeParse(values);
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.path).toEqual(["minOrder"]);
    // An unchanged value is not re-checked: only changes are sent.
    expect(storeFormSchema(MERCHANT_FIELDS, values).safeParse(values).success).toBe(true);
  });
});
