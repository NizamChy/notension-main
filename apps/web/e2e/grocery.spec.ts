import { expect, test, type Page } from "@playwright/test";

// Safety net for the Grocery refactor: runs on demo data from a cleared
// localStorage and checks what a shopper sees. Closedness of a demo store is
// the `is_closed` flag only (no opening-hours check), so these do not depend
// on the clock.
test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
    localStorage.setItem("notension-sample-data", "on");
  });
});

const STORE_ID = "6650a00100000000000000a1";
const STORE_PATH = `/grocery/gulshan-fresh-mart/${STORE_ID}/GS260001`;
const STORE_NAME = "Gulshan Fresh Mart";
const CLOSED_STORE_PATH =
  "/grocery/mohakhali-krishi-bazar/6650a00100000000000000a4/GS260004";
// First "Chinigura Aromatic Rice" item of the store (demo oid e000 + index 1).
const PRODUCT_TITLE = "Chinigura Aromatic Rice";

const openStore = async (page: Page) => {
  await page.goto(STORE_PATH);
  await expect(page.getByRole("heading", { name: "Special Offer" })).toBeVisible();
};

const sidebar = (page: Page) => page.getByRole("complementary");
const addButtons = (page: Page) =>
  page.getByRole("button", { name: /^Add .* to cart$/ });

// Add an item, log in at checkout as the demo user and place the order.
const placeOrder = async (page: Page) => {
  await openStore(page);
  await addButtons(page).first().click();
  await expect(page.getByRole("button", { name: "Open cart, 1 item" })).toBeVisible();

  await page.goto(`${STORE_PATH}/checkout`);
  await page.getByRole("button", { name: "Log in as Demo User" }).click();
  await expect(page.getByText(`From ${STORE_NAME}`)).toBeVisible();

  await page.getByRole("button", { name: /^Place order/ }).click();
  await expect(page.getByText("Order placed successfully")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${STORE_PATH}$`));
};

test("store home shows sections", async ({ page }) => {
  await openStore(page);
  for (const name of ["Special Offer", "Deal of The Day", "Popular Items"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  await expect(sidebar(page).getByRole("button").first()).toBeVisible();
});

test("type and sub-type pages list items", async ({ page }) => {
  await openStore(page);
  await sidebar(page).getByRole("button").first().click();
  await expect(page).toHaveURL(/\/grocery\/[^/]+\/[^/]+\/[^/]+\/type\//);

  // The type page lists its sub-type tiles; each tile opens its items.
  const tile = page.locator("button[title]").filter({ has: page.locator("img") }).first();
  await expect(tile).toBeVisible();
  await tile.click();
  await expect(page).toHaveURL(/\/sub-type\//);
  await expect(addButtons(page).first()).toBeVisible();
});

test("search finds items", async ({ page }) => {
  await openStore(page);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const box = page.getByRole("searchbox", { name: "Search products in this store" });
  await box.fill("chini");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/search\?query=chini/);
  await expect(page.getByRole("button", { name: `View ${PRODUCT_TITLE}` }).first()).toBeVisible();

  await page.getByRole("button", { name: "Search", exact: true }).click();
  const box2 = page.getByRole("searchbox", { name: "Search products in this store" });
  await box2.fill("zzzz");
  await box2.press("Enter");
  await expect(page).toHaveURL(/query=zzzz/);
  await expect(page.getByText("No products found")).toBeVisible();
});

test("product direct link renders and unknown id shows not found", async ({ page }) => {
  // Item _id: store index 0 -> e000, product index 0 -> 1 (see demo data oid()).
  await page.goto(`${STORE_PATH}/product/6650e0000000000000000001`);
  await expect(
    page.getByRole("heading", { name: PRODUCT_TITLE }).first(),
  ).toBeVisible();

  await page.goto(`${STORE_PATH}/product/6650e00000000000000fffff`);
  await expect(page.getByText("Product not found")).toBeVisible();
});

test("checkout shows the cart store and places a demo order", async ({ page }) => {
  await placeOrder(page);
});

test("orders list shows the placed order", async ({ page }) => {
  await placeOrder(page);
  // The demo backend keeps placed orders in memory, so reach the list by
  // in-app navigation instead of a fresh page load.
  await page.getByRole("button", { name: /Demo User/ }).click();
  await page.getByRole("menuitem", { name: "My orders" }).click();
  await expect(page).toHaveURL(/\/orders$/);
  // Order GRO-<date>-2001 shows as its short id.
  await expect(page.getByText("#2001")).toBeVisible();
});

test("closed store shows unavailable", async ({ page }) => {
  await page.goto(CLOSED_STORE_PATH);
  await expect(page.getByText("This store is closed right now")).toBeVisible();
  await expect(page.getByRole("link", { name: "Find stores nearby" })).toBeVisible();
});
