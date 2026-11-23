import { expect, test } from "@playwright/test";

// All Care on the typed queries (PR 7): runs on demo data from a cleared
// localStorage, like the other module specs.
test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.clear();
    localStorage.setItem("notension-sample-data", "on");
  });
});

const SERVICE_ID = "6a2c10000000000000000005";
const SERVICE_NAME = "Electrician";
const PROVIDER_ID = "6a2c40000000000000000001";
const PROVIDER_NAME = "PowerFix Electric & Plumbing";
const PROVIDER_PATH = `/all-care-services/provider-details?serviceId=${SERVICE_ID}&id=${PROVIDER_ID}`;

test("home → service → provider", async ({ page }) => {
  await page.goto("/all-care-services");
  await page.getByRole("button", { name: SERVICE_NAME, exact: true }).first().click();
  await expect(page).toHaveURL(new RegExp(`/all-care-services/service/${SERVICE_ID}$`));
  await expect(page.getByRole("heading", { level: 1, name: SERVICE_NAME })).toBeVisible();

  await page.getByRole("button", { name: new RegExp(PROVIDER_NAME) }).first().click();
  await expect(page).toHaveURL(/\/all-care-services\/provider-details\?/);
  await expect(page.getByRole("heading", { level: 1, name: PROVIDER_NAME })).toBeVisible();
});

test("a direct service link shows the service and its providers", async ({ page }) => {
  await page.goto(`/all-care-services/service/${SERVICE_ID}`);
  await expect(page.getByRole("heading", { level: 1, name: SERVICE_NAME })).toBeVisible();
  await expect(page.getByText(PROVIDER_NAME).first()).toBeVisible();
});

test("a direct provider link loads, and survives a reload", async ({ page }) => {
  await page.goto(PROVIDER_PATH);
  await expect(page.getByRole("heading", { level: 1, name: PROVIDER_NAME })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: PROVIDER_NAME })).toBeVisible();
});

test("an unknown provider says not found", async ({ page }) => {
  await page.goto(`/all-care-services/provider-details?serviceId=${SERVICE_ID}&id=ffffffffffffffffffffffff`);
  await expect(page.getByText("Service provider not found")).toBeVisible();
});
