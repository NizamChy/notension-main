import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/grocery",
  "/medicine",
  "/food",
  "/fashion-lifestyle",
  "/medical-services",
  "/all-care-services",
  "/marketing-policy",
];

for (const path of pages) {
  test(`${path} renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("unknown route shows the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
});
