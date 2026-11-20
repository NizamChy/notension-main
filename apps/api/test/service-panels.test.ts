// Rider, doctor and service-provider panels, and the admin controls behind
// them (rider assignment, linking doctor / provider profiles to accounts).
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type DbHandle } from "../src/db/client";
import { appointments, careProviders, doctorChambers, doctors, patients, storeItems } from "../src/db/schema";
import { bootstrapSuperAdmins } from "../src/seed/bootstrap-admins";
import { seedAllCare } from "../src/seed/allcare";
import { seedDemo } from "../src/seed/demo";
import { seedHealthCare } from "../src/seed/healthCare";
import { client, testApp } from "./helpers";

const A = "/api/v1/admin";
const STORE = "6650a00100000000000000a1";
const OTHER_STORE = "6650a00100000000000000a2";
const SUPER = "01811111111";
const PW = "correct horse battery";

const PHONES = {
  rider1: "01710000001",
  rider2: "01710000002",
  doctor1: "01710000003",
  doctor2: "01710000004",
  doctor3: "01710000005", // doctor role, no profile linked
  provider1: "01710000006",
  provider2: "01710000007",
  owner: "01710000008", // merchant_owner of STORE
  otherOwner: "01710000009", // merchant_owner of OTHER_STORE
};

type Client = ReturnType<typeof client>;

let handle: DbHandle;
let app: ReturnType<typeof testApp>;
let su: Client;
const as: Record<keyof typeof PHONES, Client> = {} as never;
const ids: Record<keyof typeof PHONES, string> = {} as never;

const tokenOf = (link: string) => new URL(link).searchParams.get("token")!;

async function staff(key: keyof typeof PHONES, role: string, storeId?: string) {
  const res = await su.request("POST", `${A}/roles`, { phone: PHONES[key], name: key, role, storeId });
  expect(res.status).toBe(200);
  ids[key] = res.body.result.userId;
  const setup = await client(app).request("POST", `${A}/setup`, { token: tokenOf(res.body.result.setupLink), password: PW });
  expect(setup.status).toBe(200);
  // Staff sign in with phone + password.
  const c = client(app);
  expect((await c.request("POST", `${A}/login`, { phone: PHONES[key], password: PW })).status).toBe(200);
  as[key] = c;
}

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedDemo(handle.db);
  await seedHealthCare(handle.db);
  await seedAllCare(handle.db);
  app = testApp(handle.db);

  const links = await bootstrapSuperAdmins(handle.db, SUPER, "http://web.test", () => {});
  su = client(app);
  expect((await su.request("POST", `${A}/setup`, { token: tokenOf(links[SUPER]!), password: PW })).status).toBe(200);

  await staff("rider1", "rider");
  await staff("rider2", "rider");
  await staff("doctor1", "doctor");
  await staff("doctor2", "doctor");
  await staff("doctor3", "doctor");
  await staff("provider1", "service_provider");
  await staff("provider2", "service_provider");
  await staff("owner", "merchant_owner", STORE);
  await staff("otherOwner", "merchant_owner", OTHER_STORE);
}, 60_000);
afterAll(() => handle?.close());

async function customerOrder(phone = "01899999999") {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: phone });
  await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: phone, otp: sent.body.demo_otp });
  const [item] = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).limit(1);
  const res = await c.request("POST", "/client-app-api/v1/grocery/order", {
    orderObj: JSON.stringify({
      merchant_id: STORE,
      orderItems: [{ _id: item!.id, quantity: 2, sale_price: 1 }],
      paymet_method: "Cash on Delivery",
      customerInfo: { customer_name: "Karim", customer_address: "Road 2, Dhanmondi", latitude: 23.74, longitude: 90.37 },
      subTotal: 1,
      totalAmount: 1,
    }),
  });
  expect(res.status).toBe(200);
  const list = await su.request("GET", `${A}/orders`, undefined);
  return list.body.result[0].id as string;
}

// ================================================================== riders

describe("riders", () => {
  let orderId = "";

  it("GET /riders: staff who assign only", async () => {
    expect((await client(app).request("GET", `${A}/riders`)).status).toBe(401);
    expect((await as.rider1.request("GET", `${A}/riders`)).status).toBe(403);
    expect((await as.doctor1.request("GET", `${A}/riders`)).status).toBe(403);
    const res = await su.request("GET", `${A}/riders`);
    expect(res.status).toBe(200);
    expect(res.body.result.map((r: { id: string }) => r.id).sort()).toEqual([ids.rider1, ids.rider2].sort());
    expect((await as.owner.request("GET", `${A}/riders`)).status).toBe(200);
  });

  it("assigns and unassigns a rider on an order", async () => {
    orderId = await customerOrder();
    const path = `${A}/orders/${orderId}/rider`;
    expect((await client(app).request("PATCH", path, { riderId: ids.rider1 })).status).toBe(401);
    expect((await as.rider1.request("PATCH", path, { riderId: ids.rider1 })).status).toBe(403);
    expect((await as.otherOwner.request("PATCH", path, { riderId: ids.rider1 })).status).toBe(403);
    expect((await su.request("PATCH", path, { riderId: ids.doctor1 })).status).toBe(400); // not a rider
    expect((await su.request("PATCH", path, { riderId: 42 })).status).toBe(400);
    expect((await su.request("PATCH", `${A}/orders/000000000000000000000000/rider`, { riderId: ids.rider1 })).status).toBe(404);

    expect((await su.request("PATCH", path, { riderId: ids.rider2 })).status).toBe(200);
    expect((await su.request("PATCH", path, { riderId: null })).status).toBe(200);
    const none = await su.request("GET", `${A}/orders/${orderId}`);
    expect(none.body.result.rider).toBeNull();

    // The store's owner assigns riders to their own orders.
    expect((await as.owner.request("PATCH", path, { riderId: ids.rider1 })).status).toBe(200);
    const detail = await su.request("GET", `${A}/orders/${orderId}`);
    expect(detail.body.result.rider).toMatchObject({ id: ids.rider1, phone: PHONES.rider1 });
    expect(detail.body.result.assignedAt).toBeTruthy();
    const riders = await su.request("GET", `${A}/riders`);
    expect(riders.body.result.find((r: { id: string }) => r.id === ids.rider1).openDeliveries).toBe(1);
  });

  it("a rider sees only their own deliveries", async () => {
    expect((await client(app).request("GET", `${A}/rider/orders`)).status).toBe(401);
    expect((await su.request("GET", `${A}/rider/orders`)).status).toBe(403); // not a rider
    expect((await as.doctor1.request("GET", `${A}/rider/orders`)).status).toBe(403);
    expect((await as.rider1.request("GET", `${A}/rider/orders?view=nope`)).status).toBe(400);

    const mine = await as.rider1.request("GET", `${A}/rider/orders`);
    expect(mine.status).toBe(200);
    const o = mine.body.result.find((r: { id: string }) => r.id === orderId);
    expect(o).toBeTruthy();
    expect(o.store).toMatchObject({ id: STORE });
    expect(o.store.name).toBeTruthy();
    expect(o.delivery).toMatchObject({ name: "Karim", address: "Road 2, Dhanmondi" });
    expect(o.items[0].quantity).toBe(2);
    expect(o.cashToCollect).toBe(o.total);
    expect(o.nextStatus).toBeNull(); // still Pending

    const theirs = await as.rider2.request("GET", `${A}/rider/orders`);
    expect(theirs.body.result.some((r: { id: string }) => r.id === orderId)).toBe(false);
    // Riders get nothing from the store-side order list either.
    expect((await as.rider2.request("GET", `${A}/orders`)).body.result).toEqual([]);
    expect((await as.rider2.request("GET", `${A}/orders/${orderId}`)).status).toBe(403);
  });

  it("a rider moves only their own order: On the way, then Delivered", async () => {
    const path = `${A}/rider/orders/${orderId}/status`;
    expect((await client(app).request("PATCH", path, { status: "On the way" })).status).toBe(401);
    expect((await as.rider1.request("PATCH", path, { status: "On the way" })).status).toBe(409); // Pending
    for (const status of ["Accepted", "Processing"]) {
      expect((await su.request("PATCH", `${A}/orders/${orderId}/status`, { status })).status).toBe(200);
    }
    expect((await as.rider2.request("PATCH", path, { status: "On the way" })).status).toBe(403);
    expect((await su.request("PATCH", path, { status: "On the way" })).status).toBe(403);
    expect((await as.rider1.request("PATCH", path, { status: "Cancelled" })).status).toBe(400);
    expect((await as.rider1.request("PATCH", path, { status: "Delivered" })).status).toBe(409); // skip a step
    expect((await as.rider1.request("PATCH", `${A}/rider/orders/000000000000000000000000/status`, { status: "Delivered" })).status).toBe(404);

    const list = await as.rider1.request("GET", `${A}/rider/orders`);
    expect(list.body.result.find((r: { id: string }) => r.id === orderId).nextStatus).toBe("On the way");
    expect((await as.rider1.request("PATCH", path, { status: "On the way" })).status).toBe(200);
    expect((await as.rider1.request("PATCH", path, { status: "Delivered" })).status).toBe(200);

    const active = await as.rider1.request("GET", `${A}/rider/orders`);
    expect(active.body.result.some((r: { id: string }) => r.id === orderId)).toBe(false);
    const done = await as.rider1.request("GET", `${A}/rider/orders?view=done`);
    expect(done.body.result.find((r: { id: string }) => r.id === orderId).status).toBe("Delivered");
    // Delivered orders keep their rider.
    expect((await su.request("PATCH", `${A}/orders/${orderId}/rider`, { riderId: ids.rider2 })).status).toBe(409);
  });
});

// ================================================================= doctors

describe("doctors", () => {
  let d1 = "";
  let d2 = "";
  let c1 = "";
  let c2 = "";
  let a1 = "";
  let a2 = "";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );

  beforeAll(async () => {
    const chambers = await handle.db.select().from(doctorChambers);
    const byDoctor = [...new Set(chambers.map((c) => c.doctorId))];
    d1 = byDoctor[0]!;
    d2 = byDoctor[1]!;
    const ch1 = chambers.find((c) => c.doctorId === d1)!;
    const ch2 = chambers.find((c) => c.doctorId === d2)!;
    c1 = ch1.id;
    c2 = ch2.id;
    const owner = ids.owner;
    const [p] = await handle.db
      .insert(patients)
      .values({ ownerId: owner, name: "Rahima Begum", contact: "01812345678", dateOfBirth: "1990-01-01", gender: "Female" })
      .returning();
    const row = (ch: typeof ch1, serialNo: number) => ({
      userId: owner,
      patientId: p!.id,
      patientName: p!.name,
      chamberId: ch.id,
      doctorId: ch.doctorId,
      centerId: ch.centerId,
      appointmentDate: today,
      timeSlot: "05:00 PM - 09:00 PM",
      serialNo,
      limitPerSlot: 30,
    });
    const [x, y] = await handle.db.insert(appointments).values([row(ch1, 1), row(ch2, 1)]).returning();
    a1 = x!.id;
    a2 = y!.id;
  });

  it("GET /doctors and linking are admin-only", async () => {
    expect((await client(app).request("GET", `${A}/doctors`)).status).toBe(401);
    expect((await as.doctor1.request("GET", `${A}/doctors`)).status).toBe(403);
    expect((await as.owner.request("GET", `${A}/doctors`)).status).toBe(403);
    const list = await su.request("GET", `${A}/doctors?q=`);
    expect(list.status).toBe(200);
    expect(list.body.total).toBeGreaterThan(1);
    expect((await as.doctor1.request("PATCH", `${A}/doctors/${d1}/user`, { userId: ids.doctor1 })).status).toBe(403);
  });

  it("links a doctor profile to a user with the doctor role", async () => {
    expect((await su.request("PATCH", `${A}/doctors/${d1}/user`, { userId: ids.rider1 })).status).toBe(400);
    expect((await su.request("PATCH", `${A}/doctors/${d1}/user`, {})).status).toBe(400);
    expect((await su.request("PATCH", `${A}/doctors/nope/user`, { userId: ids.doctor1 })).status).toBe(404);
    expect((await su.request("PATCH", `${A}/doctors/${d1}/user`, { userId: ids.doctor1 })).status).toBe(200);
    expect((await su.request("PATCH", `${A}/doctors/${d2}/user`, { userId: ids.doctor1 })).status).toBe(409); // one profile each
    expect((await su.request("PATCH", `${A}/doctors/${d1}/user`, { userId: ids.doctor2 })).status).toBe(409); // taken
    expect((await su.request("PATCH", `${A}/doctors/${d2}/user`, { userId: ids.doctor2 })).status).toBe(200);
    const linked = await su.request("GET", `${A}/doctors?userId=${ids.doctor1}`);
    expect(linked.body.result.map((d: { id: string }) => d.id)).toEqual([d1]);
    expect(linked.body.result[0].userPhone).toBe(PHONES.doctor1);
  });

  it("the doctor sees their own profile and chambers", async () => {
    expect((await client(app).request("GET", `${A}/doctor/profile`)).status).toBe(401);
    expect((await as.rider1.request("GET", `${A}/doctor/profile`)).status).toBe(403);
    expect((await su.request("GET", `${A}/doctor/profile`)).status).toBe(403);
    expect((await as.doctor3.request("GET", `${A}/doctor/profile`)).status).toBe(404); // nothing linked
    const res = await as.doctor1.request("GET", `${A}/doctor/profile`);
    expect(res.status).toBe(200);
    expect(res.body.result.id).toBe(d1);
    expect(res.body.result.chambers.map((c: { id: string }) => c.id)).toContain(c1);
    expect(res.body.result.chambers.map((c: { id: string }) => c.id)).not.toContain(c2);
  });

  it("edits only the allowed profile fields", async () => {
    expect((await as.doctor1.request("PATCH", `${A}/doctor/profile`, { consultationFee: 800, qualifications: "MBBS, FCPS" })).status).toBe(200);
    const [row] = await handle.db.select().from(doctors).where(eq(doctors.id, d1));
    expect(row).toMatchObject({ consultationFee: 800, qualifications: "MBBS, FCPS" });
    expect((await as.doctor1.request("PATCH", `${A}/doctor/profile`, { name: "Someone else" })).status).toBe(400);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/profile`, { consultationFee: -5 })).status).toBe(400);
    expect((await as.rider1.request("PATCH", `${A}/doctor/profile`, { consultationFee: 1 })).status).toBe(403);
  });

  it("lists only their own appointments, by date", async () => {
    expect((await client(app).request("GET", `${A}/doctor/appointments`)).status).toBe(401);
    expect((await as.rider1.request("GET", `${A}/doctor/appointments`)).status).toBe(403);
    expect((await as.doctor1.request("GET", `${A}/doctor/appointments?date=tomorrow`)).status).toBe(400);
    const res = await as.doctor1.request("GET", `${A}/doctor/appointments`);
    expect(res.status).toBe(200);
    const rows = res.body.result as { id: string; patientAge: number; patientGender: string; patientPhone: string; centerName: string }[];
    expect(rows.map((r) => r.id)).toContain(a1);
    expect(rows.map((r) => r.id)).not.toContain(a2);
    const a = rows.find((r) => r.id === a1)!;
    expect(a).toMatchObject({ patientGender: "Female", patientPhone: "01812345678" });
    expect(a.patientAge).toBeGreaterThan(30);
    expect(a.centerName).toBeTruthy();
    expect((await as.doctor1.request("GET", `${A}/doctor/appointments?date=${today}`)).body.result.length).toBe(1);
    expect((await as.doctor1.request("GET", `${A}/doctor/appointments?date=2000-01-01`)).body.result).toEqual([]);
  });

  it("marks only their own appointments", async () => {
    expect((await client(app).request("PATCH", `${A}/doctor/appointments/${a1}`, { status: "Visited" })).status).toBe(401);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/appointments/${a2}`, { status: "Visited" })).status).toBe(403);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/appointments/${a1}`, { status: "Booked" })).status).toBe(400);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/appointments/nope`, { status: "Visited" })).status).toBe(404);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/appointments/${a1}`, { status: "No-show" })).status).toBe(200);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/appointments/${a1}`, { status: "Visited" })).status).toBe(200);
    const [row] = await handle.db.select().from(appointments).where(eq(appointments.id, a1));
    expect(row!.status).toBe("Visited");
    expect((await as.doctor2.request("PATCH", `${A}/doctor/appointments/${a2}`, { status: "Cancelled" })).status).toBe(200);
    expect((await as.doctor2.request("PATCH", `${A}/doctor/appointments/${a2}`, { status: "Visited" })).status).toBe(409);
  });

  it("toggles booking on their own chambers only", async () => {
    expect((await client(app).request("PATCH", `${A}/doctor/chambers/${c1}`, { bookingOpen: false })).status).toBe(401);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/chambers/${c2}`, { bookingOpen: false })).status).toBe(403);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/chambers/${c1}`, { bookingOpen: "no" })).status).toBe(400);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/chambers/${c1}`, { isPopular: true })).status).toBe(400);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/chambers/nope`, { bookingOpen: false })).status).toBe(404);
    expect((await as.doctor1.request("PATCH", `${A}/doctor/chambers/${c1}`, { bookingOpen: false })).status).toBe(200);
    const [row] = await handle.db.select().from(doctorChambers).where(eq(doctorChambers.id, c1));
    expect(row!.bookingOpen).toBe(false);
  });

  it("unlinking ends panel access to that profile", async () => {
    expect((await su.request("PATCH", `${A}/doctors/${d2}/user`, { userId: null })).status).toBe(200);
    expect((await as.doctor2.request("GET", `${A}/doctor/profile`)).status).toBe(404);
  });
});

// ======================================================= service providers

describe("service providers", () => {
  let p1 = "";
  let p2 = "";

  beforeAll(async () => {
    const rows = await handle.db.select({ id: careProviders.id }).from(careProviders).limit(2);
    p1 = rows[0]!.id;
    p2 = rows[1]!.id;
  });

  it("GET /care-providers and linking are admin-only", async () => {
    expect((await client(app).request("GET", `${A}/care-providers`)).status).toBe(401);
    expect((await as.provider1.request("GET", `${A}/care-providers`)).status).toBe(403);
    expect((await su.request("GET", `${A}/care-providers`)).body.total).toBeGreaterThan(1);
    expect((await as.provider1.request("PATCH", `${A}/care-providers/${p1}/user`, { userId: ids.provider1 })).status).toBe(403);
  });

  it("links providers to users with the service provider role", async () => {
    expect((await su.request("PATCH", `${A}/care-providers/${p1}/user`, { userId: ids.doctor1 })).status).toBe(400);
    expect((await su.request("PATCH", `${A}/care-providers/${p1}/user`, { userId: 5 })).status).toBe(400);
    expect((await su.request("PATCH", `${A}/care-providers/nope/user`, { userId: ids.provider1 })).status).toBe(404);
    expect((await su.request("PATCH", `${A}/care-providers/${p1}/user`, { userId: ids.provider1 })).status).toBe(200);
    expect((await su.request("PATCH", `${A}/care-providers/${p2}/user`, { userId: ids.provider2 })).status).toBe(200);
    expect((await su.request("PATCH", `${A}/care-providers/${p1}/user`, { userId: ids.provider2 })).status).toBe(409);
    const linked = await su.request("GET", `${A}/care-providers?userId=${ids.provider1}`);
    expect(linked.body.result.map((p: { id: string }) => p.id)).toEqual([p1]);
  });

  it("a provider sees and edits only their own listing", async () => {
    expect((await client(app).request("GET", `${A}/provider/listings`)).status).toBe(401);
    expect((await as.rider1.request("GET", `${A}/provider/listings`)).status).toBe(403);
    const mine = await as.provider1.request("GET", `${A}/provider/listings`);
    expect(mine.status).toBe(200);
    expect(mine.body.result.map((p: { id: string }) => p.id)).toEqual([p1]);
    expect(Array.isArray(mine.body.result[0].services)).toBe(true);

    expect((await as.provider1.request("PATCH", `${A}/provider/listings/${p2}`, { status: "inactive" })).status).toBe(403);
    expect((await as.rider1.request("PATCH", `${A}/provider/listings/${p1}`, { status: "inactive" })).status).toBe(403);
    expect((await as.provider1.request("PATCH", `${A}/provider/listings/nope`, { status: "inactive" })).status).toBe(404);
    expect((await as.provider1.request("PATCH", `${A}/provider/listings/${p1}`, { rating: 5 })).status).toBe(400);
    expect((await as.provider1.request("PATCH", `${A}/provider/listings/${p1}`, { status: "gone" })).status).toBe(400);
    expect(
      (await as.provider1.request("PATCH", `${A}/provider/listings/${p1}`, { status: "inactive", phone: "01712345678", serviceHours: "9 AM - 9 PM" }))
        .status,
    ).toBe(200);
    const [row] = await handle.db.select().from(careProviders).where(eq(careProviders.id, p1));
    expect(row).toMatchObject({ status: "inactive", phone: "01712345678", serviceHours: "9 AM - 9 PM" });
    await as.provider1.request("PATCH", `${A}/provider/listings/${p1}`, { status: "active" });
  });

  it("unlinking removes the listing from their panel", async () => {
    expect((await su.request("PATCH", `${A}/care-providers/${p1}/user`, { userId: null })).status).toBe(200);
    expect((await as.provider1.request("GET", `${A}/provider/listings`)).body.result).toEqual([]);
  });
});
