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
