import { defineConfig } from "@playwright/test";

// Smoke tests against demo mode. Locally they reuse an open dev server;
// in CI they build and start the app. `channel: "chrome"` uses the installed
// Chrome, so no browser download is needed.
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: { baseURL: "http://localhost:3000", channel: "chrome" },
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
