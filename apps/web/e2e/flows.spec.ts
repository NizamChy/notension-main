import { expect, test, type Page } from "@playwright/test";

// Safety net for the state migration: each flow runs on demo data (so it
// does not depend on the live API), from a cleared localStorage, and checks
// that what the visitor did is still there after a reload.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // The init script runs on every load, including reloads. Clear and force
    // demo data only the first time so the reload keeps what the app saved.
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
    localStorage.setItem("notension-sample-data", "on");
  });
});

const openLogin = (page: Page) =>
  page.getByRole("button", { name: "Log in", exact: true }).first();

test("grocery cart survives reload", async ({ page }) => {
  await page.goto("/grocery/home");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /^Open (?!cart|menu)/ }).first().click();
  await expect(page).toHaveURL(/\/grocery\/[^/]+\/[^/]+\/[^/]+/);
  await page.getByRole("button", { name: /^Add .* to cart$/ }).first().click();

  const cart = page.getByRole("button", { name: /^Open cart, / });
  await expect(cart).toHaveAccessibleName("Open cart, 1 item");

  await page.reload();
  await expect(cart).toHaveAccessibleName("Open cart, 1 item");
});

test("fashion bag survives reload", async ({ page }) => {
  await page.goto(
    "/fashion-lifestyle/view-product/premium-cotton-crew-tshirt_66f9d0c70000000000000008",
  );
  // The demo T-shirt has sizes, and adding to the bag needs one picked.
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();

  const bag = page.getByRole("button", { name: "Shopping bag" });
  await expect(bag).toHaveText("1");

  await page.reload();
  await expect(bag).toHaveText("1");
});

test("demo user login shows account", async ({ page }) => {
  await page.goto("/");
  await openLogin(page).click();
  await page.getByRole("button", { name: "Log in as Demo User" }).click();

  const account = page.getByRole("button", { name: /Demo User/ });
  await expect(account).toBeVisible();
  await expect(openLogin(page)).toHaveCount(0);

  await page.reload();
  await expect(account).toBeVisible();
});

test("doctor list renders", async ({ page }) => {
  await page.goto("/medical-services/doctor");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /^(?!Previous|Next).* doctors$/ }).first().click();
  await expect(page).toHaveURL(/\/medical-services\/doctor\/dept\//);
  await expect(
    page.getByRole("button", { name: "Book appointment" }).first(),
  ).toBeVisible();
});

// ---- Saved data from before the state migration --------------------------
// Seed the old formats (redux-persist `persist:root`, Fashion `cart`) on the
// first load only, then check the new stores picked them up.
const seedLegacy = async (
  page: Page,
  data: { root?: unknown; rootRaw?: string; cart?: unknown; cartRaw?: string },
) => {
  await page.addInitScript((d) => {
    if (sessionStorage.getItem("e2e-legacy-seeded")) return;
    sessionStorage.setItem("e2e-legacy-seeded", "1");
    if (d.rootRaw !== undefined) localStorage.setItem("persist:root", d.rootRaw);
    if (d.root !== undefined) localStorage.setItem("persist:root", JSON.stringify(d.root));
    if (d.cartRaw !== undefined) localStorage.setItem("cart", d.cartRaw);
    if (d.cart !== undefined) localStorage.setItem("cart", JSON.stringify(d.cart));
  }, data);
};

// redux-persist v1 writes every slice as a JSON string inside the root JSON.
const persistRoot = (slices: Record<string, unknown>) => {
  const root: Record<string, string> = {};
  for (const [k, v] of Object.entries(slices)) root[k] = JSON.stringify(v);
  root._persist = JSON.stringify({ version: 1, rehydrated: true });
  return root;
};

const groceryStore = {
  _id: "6650a00100000000000000a1",
  custom_store_id: "GS260001",
  shop_name: "Gulshan Fresh Mart",
  shop_address: "House 12, Road 90, Gulshan 2, Dhaka 1212",
  districtId: "64f032f6c6635d0242c01e03",
  is_active: true,
  min_purchage_amount: 1000,
  min_delivery_charge: 0,
  max_delivery_charge: 50,
};
const groceryItem = {
  _id: "6650e0000000000000000001",
  product_title_eng: "Chinigura Aromatic Rice",
  product_title_beng: "চিনিগুড়া চাল",
  pack_size: "1 kg",
  unit_symbol: "kg",
  max_retail_price: 160,
  sale_price: 150,
  app_image: "grocery/chinigura-rice.webp",
  is_available: true,
  stock_qty: 50,
  productInfoTable: "6650d0010000000000000001",
  groceryStoreId: groceryStore._id,
  custom_store_id: groceryStore.custom_store_id,
  less: 6,
  less_type: "Percent",
  max_allowed: 10,
  quantity: 1,
};
const demoUserInfo = {
  _id: "65a1d0c0e4b0a1b2c3d4e5f6",
  custom_id: "CUS0000001",
  customer_name: "Demo User",
  customer_address: "House 12, Road 45, Gulshan 2, Dhaka",
  email: "demo.user@example.com",
  contact_no: "01700000000",
  alternative_contact_no: "",
  district_id: "64f032f6c6635d0242c01e03",
  district_name_by_location: "Dhaka (ঢাকা)",
  district_area_id: "303030303030303030303030",
  district_subarea_id: "303030303030303030303030",
  ref_contact: "",
  location: { type: "Point", coordinates: [23.7925, 90.4078] },
};
const fashionLine = {
  _id: "66f9d0c70000000000000008",
  product_title: "Premium Cotton Crew T-Shirt",
  sale_price: 550,
  max_retail_price: 690,
  quantity: 1,
  selectedSize: "M",
  selectedImage: null,
  selectedColor: "Black",
  addedAt: "2026-11-01T10:00:00.000Z",
};

test("old saved cart is kept", async ({ page }) => {
  await seedLegacy(page, {
    root: persistRoot({
      cart: {
        groceryItems: [groceryItem],
        groceryStoreInfo: groceryStore,
        groceryCartStartAt: Date.now(),
        foodItems: [],
        foodStoreInfo: {},
        foodCartStartAt: 0,
        medicineItems: [],
        medicineStoreInfo: {},
        medicineCartStartAt: 0,
      },
    }),
    cart: [fashionLine],
  });

  // The cart button lives on the store pages, so open a store first.
  await page.goto("/grocery/home");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /^Open (?!cart|menu)/ }).first().click();
  await expect(page).toHaveURL(/\/grocery\/[^/]+\/[^/]+\/[^/]+/);
  await expect(page.getByRole("button", { name: /^Open cart, / })).toHaveAccessibleName(
    "Open cart, 1 item",
  );

  await page.goto("/fashion-lifestyle");
  await expect(page.getByRole("button", { name: "Shopping bag" })).toHaveText("1");

  // Once migrated, the old keys are gone.
  const legacy = await page.evaluate(() => [localStorage.getItem("persist:root"), localStorage.getItem("cart")]);
  expect(legacy).toEqual([null, null]);
});

test("old login is kept", async ({ page }) => {
  await seedLegacy(page, {
    root: persistRoot({ user: { isLoggedin: true, userInfo: demoUserInfo } }),
  });
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Demo User/ })).toBeVisible();
  await expect(openLogin(page)).toHaveCount(0);
});

test("broken saved data does not crash", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (e) => errors.push(e));
  await seedLegacy(page, { rootRaw: "oops", cartRaw: "{}" });
  await page.goto("/");
  await expect(openLogin(page)).toBeVisible();
  expect(errors).toEqual([]);
});

test("first visit gets Dhaka", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /^Delivering to Dhaka/ })).toBeVisible();
});
