import { expect, test } from "@playwright/test";

// The home, guide and policy pages render on the server; every other page
// sends a loader until the saved stores load in the browser.

test("home page HTML has the landing content", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("without the tension.");
});

test("guide and policy pages render on the server", async ({ request }) => {
  for (const path of ["/guide", "/marketing-policy"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(/<h1[^>]*>/);
  }
});

test("a store-backed page sends a loader, not a blank body", async ({ request }) => {
  const html = await (await request.get("/grocery")).text();
  expect(html).toContain("bg-(--background)");
});

test("home page hydrates without React errors", async ({ page }) => {
  const problems: string[] = [];
  page.on("pageerror", (e) => problems.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && /hydrat/i.test(m.text())) problems.push(m.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("without the tension.");
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});
