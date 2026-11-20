// Favourites: per signed-in user, same response shapes as demo mode. Each
// sequence of requests runs against the demo handlers and the API; bodies
// must match apart from the generated entry ids.
import { favourites as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEMO_ROUTES } from "@/demo/routes";
import { createDb, type DbHandle } from "../src/db/client";
import { client, testApp } from "./helpers";

const P = "/api/v1/customer";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

async function signIn(phone: string) {
  const c = client(app);
  const sent = await c.request("POST", `${P}/send-otp`, { contact_no: phone });
  const verified = await c.request("POST", `${P}/verify-otp`, { contact_no: phone, otp: sent.body.demo_otp });
  expect(verified.status).toBe(200);
  return { c, me: verified.body.result as { _id: string; custom_id: string } };
}

const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "USER");
const demo = (method: string, path: string, body: Record<string, unknown>) => {
  const route = demoRoutes.find((r) => r.method === method && r.path === `${P}/${path}`);
  if (!route) throw new Error(`no demo route ${method} ${path}`);
  const out = route.handler({ query: method === "GET" ? body : {}, body: method === "GET" ? undefined : body, params: {} });
  return JSON.parse(JSON.stringify(out));
};

// Entry ids are random on both sides.
const withoutIds = (body: any) => ({
  ...body,
  result: Array.isArray(body.result) ? body.result.map(({ _id, ...rest }: any) => rest) : body.result,
});

const groceryStore = (n: number) => ({
  storeId: `6650a00100000000000000a${n}`,
  custom_store_id: `GS26000${n}`,
  shop_name: `Store ${n}`,
  shop_address: "Gulshan, Dhaka",
  shop_banner_app: `grocery/store-${n}.webp`,
  contact_no: "01700000000",
  alternative_contact_no: null,
});

let seq = 0;

// Runs the steps against demo mode and the API with a fresh account.
async function compare(steps: [method: "GET" | "POST", path: string, body: Record<string, unknown>][]) {
  const phone = `0171${String(5000000 + ++seq).padStart(7, "0")}`;
  const { c, me } = await signIn(phone);
  for (const [method, path, body] of steps) {
    const sent = { customerInfo: me._id, custom_customer_id: me.custom_id, ...body };
    const want = demo(method, path, sent);
    const url = method === "GET" ? `${P}/${path}?${new URLSearchParams(body as Record<string, string>)}` : `${P}/${path}`;
    const got = await c.request(method, url, method === "GET" ? undefined : sent);
    expect(got.status, `${method} ${path}`).toBe(200);
    contract.entriesResult.parse(got.body);
    expect(withoutIds(got.body), `${method} ${path}`).toEqual(withoutIds(want));
  }
  return c;
}

describe("favourites match demo mode", () => {
  it("stores: add, push, re-push, remove, info", async () => {
    await compare([
      ["POST", "add-favourite-store", { merchantType: 0, ...groceryStore(1) }],
      ["POST", "push-store", { merchantType: 0, ...groceryStore(2) }],
      ["POST", "push-store", { merchantType: 0, ...groceryStore(3) }],
      ["POST", "push-store", { merchantType: 0, ...groceryStore(1) }], // moves to the end
      ["POST", "push-store", { merchantType: 1, ...groceryStore(4) }],
      ["POST", "get-favourite-store-info", { merchantType: 0 }],
      ["GET", "get-favourite-store-info", { merchantType: "1" }],
      ["POST", "get-favourite-store-info", {}],
      ["POST", "remove-store", { merchantType: 0, storeId: groceryStore(2).storeId }],
      ["POST", "remove-store", { merchantType: 0, storeId: "6650a0010000000000000fff" }], // not there
      ["POST", "add-favourite-store", { merchantType: 0, ...groceryStore(5) }], // replaces the list
      ["POST", "get-favourite-store-info", { merchantType: 0 }],
    ]);
  });

  it("items: grocery and medicine lists are separate", async () => {
    const rice = { productId: "6650d0010000000000000001", product_title_eng: "Rice", pack_size: "5 kg", app_image: "r.webp" };
    const napa = { productId: "6650d0010000000000000002", item_title_eng: "Napa", strength: "500 mg", app_image: "n.webp" };
    await compare([
      ["POST", "add-favourite-item", { merchantType: 0, ...rice }],
      ["POST", "push-item", { merchantType: 1, ...napa }],
      ["POST", "get-favourite-item-info", { merchantType: 0 }],
      ["POST", "remove-item", { merchantType: 1, ...napa }],
      ["GET", "get-favourite-item-info", {}],
    ]);
  });

  it("list: centres and doctors", async () => {
    const centre = { mongodbId: "6650e0010000000000000001", center_name: "City Care", address: "Dhanmondi" };
    const doctor = { mongodbId: "6650e0010000000000000002", doctor_name: "Dr. A", speciality: "Medicine" };
    await compare([
      ["POST", "add-to-favourite-list", { merchantType: 3, ...centre }],
      ["POST", "push-to-favourite-list", { merchantType: 4, ...doctor }],
      ["POST", "get-favourite-list", {}],
      ["POST", "remove-from-favourite-list", { merchantType: 3, mongodbId: centre.mongodbId }],
      ["POST", "get-favourite-list", { merchantType: 3 }],
    ]);
  });
});

describe("favourites belong to the signed-in user", () => {
  it("requires a session", async () => {
    for (const path of ["add-favourite-store", "push-item", "remove-from-favourite-list", "get-favourite-list"]) {
      const res = await client(app).request("POST", `${P}/${path}`, { merchantType: 0, storeId: "x" });
      expect(res.status, path).toBe(401);
    }
    expect((await client(app).request("GET", `${P}/get-favourite-store-info`)).status).toBe(401);
  });

  it("ignores customerInfo from the body", async () => {
    const alice = await signIn("01716000001");
    const bob = await signIn("01716000002");
    // Alice tries to write into Bob's list.
    const added = await alice.c.request("POST", `${P}/add-favourite-store`, {
      merchantType: 0,
      customerInfo: bob.me._id,
      custom_customer_id: bob.me.custom_id,
      ...groceryStore(1),
    });
    expect(added.status).toBe(200);
    expect(added.body.result[0]).not.toHaveProperty("customerInfo");
    expect(added.body.result[0]).not.toHaveProperty("custom_customer_id");

    const bobs = await bob.c.request("POST", `${P}/get-favourite-store-info`, { customerInfo: bob.me._id });
    expect(bobs.body.result).toEqual([]);
    const alices = await alice.c.request("POST", `${P}/get-favourite-store-info`, { customerInfo: bob.me._id });
    expect(alices.body.result.map((e: any) => e.storeId)).toEqual([groceryStore(1).storeId]);

    // Bob can't remove Alice's entry either.
    await bob.c.request("POST", `${P}/remove-store`, { merchantType: 0, storeId: groceryStore(1).storeId });
    const still = await alice.c.request("GET", `${P}/get-favourite-store-info?merchantType=0`);
    expect(still.body.result).toHaveLength(1);
  });

  it("rejects bad input", async () => {
    const { c } = await signIn("01716000003");
    const bad: [string, unknown][] = [
      ["add-favourite-store", { merchantType: 0 }], // no storeId
      ["push-store", { storeId: "6650a00100000000000000a1" }], // no merchantType
      ["push-item", { merchantType: "abc", productId: "p" }],
      ["push-item", { merchantType: -1, productId: "p" }],
      ["remove-from-favourite-list", { merchantType: 3, mongodbId: "" }],
      ["push-to-favourite-list", { merchantType: 3, mongodbId: "x", note: "y".repeat(5000) }],
      ["push-store", "not an object"],
    ];
    for (const [path, body] of bad) {
      const res = await c.request("POST", `${P}/${path}`, body);
      expect(res.status, path).toBe(400);
      expect(res.body.success).toBe(false);
    }
    expect((await c.request("GET", `${P}/get-favourite-list?merchantType=x`)).status).toBe(400);
  });

  it(`stops at ${contract.MAX_PER_LIST} per list`, async () => {
    const { c } = await signIn("01716000004");
    for (let i = 0; i < contract.MAX_PER_LIST; i++) {
      const res = await c.request("POST", `${P}/push-item`, { merchantType: 0, productId: `p${i}` });
      expect(res.status).toBe(200);
    }
    expect((await c.request("POST", `${P}/push-item`, { merchantType: 0, productId: "one-more" })).status).toBe(409);
    // Re-pushing an existing one still works, and other lists are separate.
    expect((await c.request("POST", `${P}/push-item`, { merchantType: 0, productId: "p0" })).status).toBe(200);
    expect((await c.request("POST", `${P}/push-item`, { merchantType: 1, productId: "one-more" })).status).toBe(200);
  });
});
