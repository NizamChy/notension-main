import { expect, test, type Page } from "@playwright/test";

// Fashion on the typed API and the Zustand wishlist (PR 5): runs on demo data
// from a cleared localStorage, like the other module specs.
test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
    localStorage.setItem("notension-sample-data", "on");
  });
});

const PRODUCT_TITLE = "Premium Cotton Crew T-Shirt";
const PRODUCT_PATH =
  "/fashion-lifestyle/view-product/premium-cotton-crew-tshirt_66f9d0c70000000000000008";
const STORE_NAME = "Dhaka Fashion House";

const productHeading = (page: Page, name = PRODUCT_TITLE) =>
  page.getByRole("heading", { level: 1, name });

const wishlistBadge = (page: Page) => page.getByRole("link", { name: "Wishlist" });

test("a product card opens its details page", async ({ page }) => {
  await page.goto("/fashion-lifestyle");
  const card = page.locator('a[href*="/fashion-lifestyle/view-product/"]').first();
  await expect(card).toBeVisible();
  const title = (await card.locator("h3").innerText()).trim();

  await card.click();
  await expect(page).toHaveURL(/\/fashion-lifestyle\/view-product\//);
  await expect(productHeading(page, title)).toBeVisible();
});

test("a direct product link loads, and survives a reload", async ({ page }) => {
  await page.goto(PRODUCT_PATH);
  await expect(productHeading(page)).toBeVisible();
  await page.reload();
  await expect(productHeading(page)).toBeVisible();
});

test("an unknown product shows not found", async ({ page }) => {
  await page.goto("/fashion-lifestyle/view-product/nothing_ffffffffffffffffffffffff");
  await expect(page.getByText("Product not found")).toBeVisible();
});

test("wishlist: add, keep after reload, remove", async ({ page }) => {
  await page.goto(PRODUCT_PATH);
  await expect(productHeading(page)).toBeVisible();

  await page.getByRole("button", { name: "Add to wishlist" }).first().click();
  await expect(wishlistBadge(page)).toHaveText("1");

  await page.reload();
  await expect(wishlistBadge(page)).toHaveText("1");

  await page.goto("/fashion-lifestyle/wishlist");
  await expect(page.getByText("1 saved item")).toBeVisible();
  await expect(page.getByRole("heading", { name: PRODUCT_TITLE })).toBeVisible();

  await page.getByRole("button", { name: "Remove from wishlist" }).first().click();
  await expect(wishlistBadge(page)).toHaveText("");
  await expect(page.getByRole("heading", { name: PRODUCT_TITLE })).toHaveCount(0);
});

test("the store page shows the store and its products", async ({ page }) => {
  await page.goto(PRODUCT_PATH);
  await page.getByRole("link", { name: "Visit store" }).click();
  await expect(page).toHaveURL(/\/fashion-lifestyle\/shop\//);
  await expect(page.getByRole("heading", { level: 1, name: STORE_NAME })).toBeVisible();
  // Store pages link products under the store: /shop/<store>/view-product/...
  const storeProduct = page.locator('a[href*="/shop/"][href*="/view-product/"]').first();
  await expect(storeProduct).toBeVisible();
  const title = (await storeProduct.locator("h3").innerText()).trim();
  await storeProduct.click();
  await expect(productHeading(page, title)).toBeVisible();
});

test("checkout places the order and it shows in My orders", async ({ page }) => {
  await page.goto(PRODUCT_PATH);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Buy now" }).click();
  await expect(page).toHaveURL(/\/fashion-lifestyle\/checkout$/);

  const demoLogin = page.getByRole("button", { name: "Log in as Demo User" });
  await demoLogin.click();
  await expect(demoLogin).toHaveCount(0);

  await page.getByRole("button", { name: /^Place order/ }).click();
  await expect(page.getByText("Order placed successfully")).toBeVisible();

  // Client-side navigation: demo orders live in memory, so a full page load
  // would drop the new one.
  await page.getByRole("button", { name: "View my orders" }).click();
  await expect(page).toHaveURL(/\/fashion-lifestyle\/orders$/);
  // Two sample orders plus the new one.
  await expect(page.getByText("3 orders")).toBeVisible();
  await expect(page.getByText(STORE_NAME).first()).toBeVisible();
});
