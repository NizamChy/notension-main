import { expect, test, type Page } from "@playwright/test";

// Food on the typed queries (PR 4): runs on demo data from a cleared
// localStorage, like grocery.spec.ts.
test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
    localStorage.setItem("notension-sample-data", "on");
  });
});

// Demo ids: hexId(kind, n) = "66f00d" + kind + n (16 hex digits).
const CATEGORY_ID = "66f00d100000000000000001"; // Biryani & Bangla
const CATEGORY_NAME = "Biryani & Bangla";
const STORE_NAME = "Kacchi Ghor";
const STORE_PATH = "/food/store/kacchi-ghor/66f00d200000000000000001/FS-1001";
const CLOSED_STORE_PATH = "/food/store/sea-breeze-cafe/66f00d200000000000000007/FS-2002";
const DISH_ID = "66f00d400000000000000001";
const DISH_TITLE = "Mutton Kacchi Biryani";
const GROCERY_STORE_PATH = "/grocery/gulshan-fresh-mart/6650a00100000000000000a1/GS260001";

const openStore = async (page: Page) => {
  await page.goto(STORE_PATH);
  await expect(page.getByRole("heading", { name: STORE_NAME }).first()).toBeVisible();
};

const addButtons = (page: Page) => page.getByRole("button", { name: /^Add .* to cart$/ });

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

test("food home lists the restaurant categories", async ({ page }) => {
  await page.goto("/food");
  await expect(page.getByText(CATEGORY_NAME).first()).toBeVisible();
});

test("a category lists nearby restaurants", async ({ page }) => {
  await page.goto(`/food/${CATEGORY_ID}/find-store`);
  await expect(page.getByRole("heading", { name: CATEGORY_NAME }).first()).toBeVisible();
  await expect(page.getByText(STORE_NAME).first()).toBeVisible();
});

test("restaurant shows its menu and a category page", async ({ page }) => {
  await openStore(page);
  await expect(page.getByText(DISH_TITLE).first()).toBeVisible();
  await expect(addButtons(page).first()).toBeVisible();
});

test("dish direct link renders, unknown id shows not found", async ({ page }) => {
  await page.goto(`${STORE_PATH}/product/${DISH_ID}`);
  await expect(page.getByRole("heading", { name: DISH_TITLE }).first()).toBeVisible();

  await page.goto(`${STORE_PATH}/product/66f00d40000000000000ffff`);
  await expect(page.getByText(/not found/i).first()).toBeVisible();
});

test("checkout shows the restaurant and places a demo order", async ({ page }) => {
  await placeOrder(page);
});

test("orders list shows the placed order", async ({ page }) => {
  await placeOrder(page);
  await page.getByRole("button", { name: /Demo User/ }).click();
  await page.getByRole("menuitem", { name: "My orders" }).click();
  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByText(/^#\d{4}$/).first()).toBeVisible();
});

test("closed restaurant shows unavailable", async ({ page }) => {
  await page.goto(CLOSED_STORE_PATH);
  await expect(page.getByText("This store is closed right now")).toBeVisible();
});

test("grocery then food shows the restaurant from the URL", async ({ page }) => {
  await page.goto(GROCERY_STORE_PATH);
  await expect(page.getByRole("heading", { name: "Special Offer" })).toBeVisible();
  await openStore(page);
  await expect(page.getByText(DISH_TITLE).first()).toBeVisible();
});

test("reload on a dish page", async ({ page }) => {
  await openStore(page);
  await page.getByRole("button", { name: `View ${DISH_TITLE}` }).first().click();
  await expect(page).toHaveURL(/\/product\/[0-9a-f]{24}$/);
  await page.reload();
  await expect(page.getByRole("heading", { name: DISH_TITLE }).first()).toBeVisible();
});
