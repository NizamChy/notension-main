// Builds public/demo-accounts.pdf from packages/shared/src/demo-accounts.json
// (the same list the API seeds and the site shows): writes an HTML page, then
// prints it with headless Chrome.
//
//   node apps/web/scripts/demo-accounts-pdf.mjs [path/to/chrome]
//
// Chrome is looked up in CHROME_PATH, the argument, or the usual install
// folders.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(here, "../../../packages/shared/src/demo-accounts.json"), "utf8"));
const out = join(here, "../public/demo-accounts.pdf");
const SITE = "https://notension-main.vercel.app";

const ROLE_LABELS = {
  super_admin: "Super admin",
  admin: "Admin",
  support: "Support",
  finance: "Finance",
  content_manager: "Content manager",
  merchant_owner: "Store owner",
  merchant_manager: "Store manager",
  merchant_staff: "Store staff",
  rider: "Rider",
  doctor: "Doctor",
  service_provider: "Service provider",
  customer: "Customer",
};

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const rows = data.accounts
  .map(
    (a) => `<tr>
      <td><b>${esc(ROLE_LABELS[a.role] ?? a.role)}</b>${a.storeName ? `<br><small>${esc(a.storeName)}</small>` : ""}</td>
      <td>${esc(a.name)}</td>
      <td class="mono">${esc(a.phone)}</td>
      <td class="mono">${esc(data.password)}</td>
      <td>${esc(a.can)}</td>
    </tr>`,
  )
  .join("");
const c = data.customer;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>NoTension demo accounts</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  body { font: 10pt/1.4 "Segoe UI", Arial, sans-serif; color: #111827; margin: 0; }
  h1 { font-size: 20pt; margin: 0; color: #0c3f8e; }
  .sub { color: #4b5563; margin: 4px 0 14px; }
  .links { display: flex; gap: 24px; margin-bottom: 14px; padding: 10px 12px; background: #f3f4f6; border-radius: 6px; }
  .links div span { display: block; font-size: 8pt; text-transform: uppercase; letter-spacing: .04em; color: #6b7280; }
  .mono { font-family: Consolas, "Courier New", monospace; white-space: nowrap; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: .04em; color: #6b7280; border-bottom: 1.5px solid #d1d5db; padding: 6px; }
  td { vertical-align: top; border-bottom: 1px solid #e5e7eb; padding: 6px; }
  tr { break-inside: avoid; }
  small { color: #6b7280; }
  h2 { font-size: 12pt; margin: 18px 0 6px; }
  .note { color: #4b5563; font-size: 9pt; margin-top: 14px; }
</style></head><body>
  <h1>NoTension demo accounts</h1>
  <p class="sub">One sign-in for every role. These are public demo accounts: the password can't be changed and is reset on every deploy.</p>
  <div class="links">
    <div><span>Site</span>${SITE}</div>
    <div><span>Staff login</span>${SITE}/admin/login</div>
    <div><span>Password (all staff)</span><b class="mono">${esc(data.password)}</b></div>
  </div>
  <table>
    <thead><tr><th>Role</th><th>Name</th><th>Phone</th><th>Password</th><th>What they can do</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <h2>Customer</h2>
  <table><tbody><tr>
    <td><b>Customer</b></td><td>${esc(c.name)}</td><td class="mono">${esc(c.phone)}</td><td>No password</td>
    <td>${esc(c.can)} Sign in at ${SITE}/login.</td>
  </tr></tbody></table>
  <p class="note">Staff sign in at /admin/login with the phone number and password above, or tap a role in the "Demo accounts" list on that page. The list is also at ${SITE}/demo-accounts.</p>
</body></html>`;

const candidates = [
  process.env.CHROME_PATH,
  process.argv[2],
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome not found. Pass its path as an argument or set CHROME_PATH.");
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), "demo-pdf-"));
const page = join(dir, "demo-accounts.html");
writeFileSync(page, html);
try {
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${join(dir, "profile")}`,
      `--print-to-pdf=${out}`,
      pathToFileURL(page).href,
    ],
    { stdio: "inherit" },
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`wrote ${out}`);
