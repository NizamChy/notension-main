import { expect, test, type Page } from "@playwright/test";

// Favourites in their Zustand store (PR 8): runs on demo data from a cleared
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

const logIn = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in", exact: true }).first().click();
  const demoLogin = page.getByRole("button", { name: "Log in as Demo User" });
  await demoLogin.click();
  await expect(demoLogin).toHaveCount(0);
};

test("a favourite grocery store is saved, kept after a reload, and removed", async ({ page }) => {
  await logIn(page);
  await page.goto("/grocery/home");
  const firstStore = page.getByRole("button", { name: /^Open (?!cart|menu)/ }).first();
  const name = ((await firstStore.getAttribute("aria-label")) ?? "").replace(/^Open /, "");
  await page.getByRole("button", { name: "Add to favourites" }).first().click();
  await expect(page.getByText("Added to favourites")).toBeVisible();

  await page.goto("/grocery/favorite-stores");
  await expect(page.getByText(name).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(name).first()).toBeVisible();

  await page.getByRole("button", { name: "Remove from favourites" }).first().click();
  await expect(page.getByText("No favourite grocery stores yet")).toBeVisible();
});

test("a favourite doctor shows on the favourite doctors page", async ({ page }) => {
  await logIn(page);
  await page.goto(
    "/medical-services/doctor/consultation-center/visit/6650ce000000000000000001/doctor-profile/6650d0000000000000000001",
  );
  await page.getByRole("button", { name: "Add to favourites" }).click();
  await expect(page.getByRole("button", { name: "Saved to favourites" })).toBeVisible();

  await page.goto("/medical-services/favorite-doctor");
  await expect(page.getByText("Dr. Ahsan Habib").first()).toBeVisible();
});

test("logging out clears the favourites", async ({ page }) => {
  await logIn(page);
  await page.goto("/grocery/home");
  await page.getByRole("button", { name: "Add to favourites" }).first().click();
  await expect(page.getByText("Added to favourites")).toBeVisible();

  const saved = await page.evaluate(() => localStorage.getItem("notension-favourites") ?? "");
  expect(saved).toContain("store:0");

  await page.getByRole("button", { name: /Demo User/ }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page.getByRole("button", { name: "Log in", exact: true }).first()).toBeVisible();

  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("notension-favourites") ?? "{}"));
  expect(after?.state?.lists ?? {}).toEqual({});
});
