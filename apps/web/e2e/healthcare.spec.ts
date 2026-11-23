import { expect, test, type Page } from "@playwright/test";

// Health Care on the typed queries (PR 6): runs on demo data from a cleared
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

// Demo ids: oid(kind, n) = "6650" + kind + n (18 digits).
const DOCTOR_ID = "6650d0000000000000000001";
const DOCTOR_NAME = "Dr. Ahsan Habib";
const CENTER_ID = "6650ce000000000000000001";
const CENTER_NAME = "Gulshan Medicare Hospital";
const CENTER_PATH = `/medical-services/doctor/consultation-center/visit/${CENTER_ID}`;
const PROFILE_PATH = `${CENTER_PATH}/doctor-profile/${DOCTOR_ID}`;
const BOOKING_PATH = `/medical-services/doctor/book-appointment?doctor=${DOCTOR_ID}&center=${CENTER_ID}`;

const logInAsDemoUser = async (page: Page) => {
  const demoLogin = page.getByRole("button", { name: "Log in as Demo User" });
  await demoLogin.click();
  await expect(demoLogin).toHaveCount(0);
};

test("doctor home → department → a doctor's profile", async ({ page }) => {
  await page.goto("/medical-services/doctor");
  await page.getByRole("button", { name: /^(?!Previous|Next).* doctors$/ }).first().click();
  await expect(page).toHaveURL(/\/medical-services\/doctor\/dept\//);
  await expect(page.getByRole("heading", { name: /specialists$/ }).first()).toBeVisible();

  await page.getByRole("button", { name: "Book appointment" }).first().click();
  await expect(page).toHaveURL(/doctor-profile\/|\/doctor\/profile\//);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
});

test("a direct profile link loads the doctor", async ({ page }) => {
  await page.goto(PROFILE_PATH);
  await expect(page.getByRole("heading", { name: DOCTOR_NAME }).first()).toBeVisible();
  await expect(page.getByText(CENTER_NAME).first()).toBeVisible();
});

test("a centre page loads from a direct link, an unknown one says not found", async ({ page }) => {
  await page.goto(CENTER_PATH);
  await expect(page.getByText(CENTER_NAME).first()).toBeVisible();
  await expect(page.getByText("Doctors at this centre")).toBeVisible();

  await page.goto("/medical-services/doctor/consultation-center/visit/6650ceffffffffffffffffff");
  await expect(page.getByText("Centre not found")).toBeVisible();
});

test("the hospital listing shows the district's hospitals", async ({ page }) => {
  await page.goto("/medical-services/hospital");
  await expect(page.getByText(CENTER_NAME).first()).toBeVisible();
});

test("centre search finds by name", async ({ page }) => {
  await page.goto("/medical-services/search/search-center?query=Gulshan");
  await expect(page.getByText(/Results for/)).toBeVisible();
  await expect(page.getByText(CENTER_NAME).first()).toBeVisible();
});

test("the booking page without a doctor asks to choose one", async ({ page }) => {
  await page.goto("/medical-services/doctor/book-appointment");
  await expect(page.getByText("Choose a doctor first")).toBeVisible();
});

test("book: log in, register a patient, book, see it in My appointments after a reload", async ({ page }) => {
  await page.goto(PROFILE_PATH);
  await page.getByRole("button", { name: "Book appointment" }).first().click();
  await logInAsDemoUser(page);

  // The login sends the visitor to this chamber's booking page.
  await expect(page).toHaveURL(new RegExp(`book-appointment\\?doctor=${DOCTOR_ID}&center=${CENTER_ID}`));
  await expect(page.getByText(DOCTOR_NAME).first()).toBeVisible();

  await page.getByRole("button", { name: "Register patient" }).click();
  await page.getByLabel("Patient name (রোগীর নাম)").fill("Rina Akter");
  await page.getByLabel("Mobile number (মোবাইল নাম্বার)").fill("01711000000");
  await page.getByRole("button", { name: "Register patient" }).click();

  await page.getByRole("button", { name: /Rina Akter/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radiogroup").locator("label").first().click();
  await dialog.getByRole("button", { name: "Book appointment" }).click();

  await expect(page).toHaveURL(/\/medical-services\/doctor\/booked-appointment$/);
  await expect(page.getByText(DOCTOR_NAME)).toBeVisible();
  await expect(page.getByText("Rina Akter")).toBeVisible();

  await page.reload();
  await expect(page.getByText(DOCTOR_NAME)).toBeVisible();
});

test("a direct booking link shows the chamber after a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in", exact: true }).first().click();
  await logInAsDemoUser(page);

  await page.goto(BOOKING_PATH);
  await expect(page.getByText(DOCTOR_NAME).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(DOCTOR_NAME).first()).toBeVisible();
});
