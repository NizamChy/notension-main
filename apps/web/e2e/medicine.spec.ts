import { expect, test, type Page } from "@playwright/test";

// Medicine on the shared store-module components (PR 3): runs on demo data
// from a cleared localStorage, like grocery.spec.ts.
test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
    localStorage.setItem("notension-sample-data", "on");
  });
});

// First demo pharmacy (oid "66a1" + 1); it stocks every demo product.
const STORE_ID = "66a100000000000000000001";
const STORE_PATH = `/medicine/gulshan-care-pharmacy/${STORE_ID}/MS100101`;
const STORE_NAME = "Gulshan Care Pharmacy";
// Demo pharmacy 5 is closed.
const CLOSED_STORE_PATH =
  "/medicine/gec-lifecare-pharmacy/66a100000000000000000005/MS200102";
// Product 1 in pharmacy 1: item oid "66a501" + 1.
const PRODUCT_ID = "66a501000000000000000001";
const PRODUCT_TITLE = "Napa 500mg";
const GROCERY_STORE_PATH = "/grocery/gulshan-fresh-mart/6650a00100000000000000a1/GS260001";

const openStore = async (page: Page) => {
  await page.goto(STORE_PATH);
  await expect(page.getByRole("heading", { name: "Special Offer" })).toBeVisible();
};

const sidebar = (page: Page) => page.getByRole("complementary");
const addButtons = (page: Page) => page.getByRole("button", { name: /^Add .* to cart$/ });

const search = async (page: Page, text: string) => {
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const box = page.getByRole("searchbox", { name: "Search medicines in this store" });
  await box.fill(text);
  await box.press("Enter");
};

const placeOrder = async (page: Page) => {
  await openStore(page);
  await addButtons(page).first().click();
  await expect(page.getByRole("button", { name: "Open cart, 1 item" })).toBeVisible();

  await page.goto(`${STORE_PATH}/checkout`);
  const demoLogin = page.getByRole("button", { name: "Log in as Demo User" });
  await demoLogin.click();
  await expect(demoLogin).toHaveCount(0);
  await expect(page.getByText(`From ${STORE_NAME}`, { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /^Place order/ }).click();
  await expect(page.getByText("Order placed successfully")).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`${STORE_PATH}$`));
};

test("pharmacy home shows sections", async ({ page }) => {
  await openStore(page);
  for (const name of ["Special Offer", "Deal of The Day", "Popular Items"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: STORE_NAME })).toBeVisible();
  await expect(sidebar(page).getByRole("button").first()).toBeVisible();
});

test("type and sub-type pages list medicines", async ({ page }) => {
  await openStore(page);
  await sidebar(page).getByRole("button").first().click();
  await expect(page).toHaveURL(/\/medicine\/[^/]+\/[^/]+\/[^/]+\/type\//);

  const tile = page.locator("button[title]").filter({ has: page.locator("img") }).first();
  await expect(tile).toBeVisible();
  await tile.click();
  await expect(page).toHaveURL(/\/sub-type\//);
  await expect(addButtons(page).first()).toBeVisible();
  await expect(page.getByText(/\d+\+? medicines$/)).toBeVisible();
});

test("search finds medicines", async ({ page }) => {
  await openStore(page);
  await search(page, "napa");
  await expect(page).toHaveURL(/\/search\?query=napa/);
  await expect(page.getByRole("button", { name: `View ${PRODUCT_TITLE}` }).first()).toBeVisible();
  await expect(page.getByText(/medicines found in this store/)).toBeVisible();

  await search(page, "zzzz");
  await expect(page).toHaveURL(/query=zzzz/);
  await expect(page.getByText("No medicines found")).toBeVisible();
});

test("product direct link shows medicine details, unknown id shows not found", async ({ page }) => {
  await page.goto(`${STORE_PATH}/product/${PRODUCT_ID}`);
  await expect(page.getByRole("heading", { name: PRODUCT_TITLE }).first()).toBeVisible();
  // Medicine-only details from the config.
  await expect(page.getByText("Generic name")).toBeVisible();
  await expect(page.getByText("Beximco Pharmaceuticals").first()).toBeVisible();

  await page.goto(`${STORE_PATH}/product/66a5010000000000000fffff`);
  await expect(page.getByText("Product not found")).toBeVisible();
});

test("checkout shows the pharmacy and places a demo order", async ({ page }) => {
  await placeOrder(page);
});

test("orders list shows the placed order", async ({ page }) => {
  await placeOrder(page);
  await page.getByRole("button", { name: /Demo User/ }).click();
  await page.getByRole("menuitem", { name: "My orders" }).click();
  await expect(page).toHaveURL(/\/orders$/);
  // The new order and the demo's delivered sample order.
  await expect(page.getByText(/^#\d{4}$/).first()).toBeVisible();
  await expect(page.getByText("#1001")).toBeVisible();
});

test("closed pharmacy shows unavailable", async ({ page }) => {
  await page.goto(CLOSED_STORE_PATH);
  await expect(page.getByText("This store is closed right now")).toBeVisible();
});

test("grocery then medicine uses the pharmacy from the URL", async ({ page }) => {
  await page.goto(GROCERY_STORE_PATH);
  await expect(page.getByRole("heading", { name: "Special Offer" })).toBeVisible();

  await openStore(page);
  await search(page, "napa");
  await expect(page.getByRole("button", { name: `View ${PRODUCT_TITLE}` }).first()).toBeVisible();
});

test("reload on a medicine product page", async ({ page }) => {
  await page.goto(`${STORE_PATH}/search?query=napa`);
  await page.getByRole("button", { name: `View ${PRODUCT_TITLE}` }).first().click();
  await expect(page).toHaveURL(/\/product\/[0-9a-f]{24}$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: PRODUCT_TITLE }).first()).toBeVisible();
});
