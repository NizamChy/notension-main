# NoTension API

The backend for the NoTension web app: [Hono](https://hono.dev) with
[Zod](https://zod.dev) validation, [Drizzle ORM](https://orm.drizzle.team) on
Postgres + PostGIS.

It serves the **same paths and response shapes** the web app already calls
(`apps/web/src/api-endpoints`), so a module moves from demo data to the API
without changing its components. The shapes are defined once, as Zod schemas,
in `packages/shared/src/contract/` and used by both sides.

## Running it

```bash
npm run db:seed -w api   # create tables and load the demo data
npm run dev -w api       # http://localhost:4000
```

No database setup is needed: without `DATABASE_URL` the API uses
[PGlite](https://pglite.dev), Postgres compiled to WebAssembly, with PostGIS,
stored in `apps/api/.pglite/`. Delete that folder to start over.

To use a real Postgres (Neon, Supabase, local), set `DATABASE_URL`; the
PostGIS extension is created on first migration.

### Pointing the web app at it

Demo mode stays on; listed services skip demo data and call the API
through the web app's `/api-proxy/<service>/*` rewrite (so the login cookie
is first-party). In development the proxy targets `http://localhost:4000`,
in production `https://notension-api.vercel.app` (override with
`API_PROXY_TARGET`).

```bash
# apps/web/.env.local
NEXT_PUBLIC_LIVE_SERVICES=GROCERY,USER
```

`USER` moves only login and profile to the API; favourites stay on demo data
(`apps/web/src/api-endpoints/live.js`).

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | (none: PGlite) | Postgres connection string |
| `PGLITE_DIR` | `./.pglite` | Where PGlite keeps its data |
| `PORT` | `4000` | HTTP port |
| `CORS_ORIGINS` | `http://localhost:3000,https://notension-main.vercel.app` | Browser origins (also Better Auth's trusted origins) |
| `BETTER_AUTH_SECRET` | (generated, kept in `app_secret`) | Session signing secret, 32+ characters |
| `BETTER_AUTH_URL` | Vercel production URL or `http://localhost:PORT` | The API's public URL |
| `SMS_API_KEY`, `SMS_SENDER_ID` | (none) | [BulkSMSBD](https://bulksmsbd.net) credentials. Without them no SMS is sent and the OTP comes back in the send-otp response (demo behaviour) |
| `SUPER_ADMIN_PHONES` | (none) | Comma-separated numbers that become `super_admin` on sign-in. Only honoured when SMS is configured |
| `DEMO_LOGIN` | `true` | The "Log in as Demo User" shortcut (01700000000, no SMS) |

## Login and roles

Phone number + one-time code, with [Better Auth](https://better-auth.com)'s
phone-number plugin; the session is an HTTP-only cookie.

| Path | |
| --- | --- |
| `POST /api/v1/customer/send-otp` `{contact_no}` | Sends a 6-digit code (5 minutes, 5 tries) |
| `POST /api/v1/customer/verify-otp` `{contact_no, otp}` | Signs in (creates the account on first login). `is_new`: no name yet |
| `POST /api/v1/customer/register` | Saves name, address, location |
| `GET /api/v1/customer/me` | The signed-in customer, with `roles` |
| `POST /api/v1/customer/logout` | Ends the session |
| `POST /api/v1/customer/demo-login` | Signs in as the demo account |
| `/api/auth/*` | Better Auth's own endpoints |

Every new account is a `customer`. Without an SMS provider the API refuses
to echo codes for accounts holding any other role, so staff accounts are
only reachable by real SMS. Banned users (`user.banned`) can't sign in.

In routes: `requireUser`, and `requireRole(db, ["admin"])` or
`requireRole(db, ["merchant_manager"], { store: (c) => c.req.param("id") })`
(`src/auth/middleware.ts`); `super_admin` passes every check.

## Database

Schema: `src/db/schema/`. After changing it:

```bash
npm run db:generate -w api   # writes a SQL migration to drizzle/
npm run db:migrate -w api
```

- **Catalogue** (`catalog.ts`): districts, stores (one table for grocery,
  medicine, food and fashion, with a PostGIS point for "nearest store"),
  product types and subtypes, products, store items (per-store price and
  stock), sliders.
- **Accounts and roles** (`auth.ts`): Better Auth's tables (user, session,
  account, verification) plus `user_role`. A user can hold several roles.
  Platform roles are global (`super_admin`, `admin`, `support`, `finance`,
  `content_manager`); merchant roles are tied to one store
  (`merchant_owner`, `merchant_manager`, `merchant_staff`); service roles are
  `rider`, `doctor`, `service_provider`; everyone else is a `customer`.
- **Customers and orders** (`commerce.ts`): `customer` (profile: CUS0000001
  code, address, location), `order` + `order_item` (GRO-YYYYMMDD-NNNN codes;
  each line keeps a copy of the product as sold). Order amounts are always
  computed by the API from current store prices, never taken from the browser.
- IDs are 24-character hex strings, the format the web app's URLs and saved
  carts already use.

## Tests

`npm run test -w api` runs the auth/role/order tests (`test/auth-orders.test.ts`) and the parity tests: every grocery endpoint gets the
same requests as the web app's demo mode, the two responses must match, and
each API response is checked against the shared contract. They use an
in-memory PGlite database, so they need nothing installed.

## Status

| Module | Endpoints |
| --- | --- |
| Grocery | Stores (nearest, search, explore), items (search, by subtype, by custom type, details), orders (place, my orders) |
| Medicine | Stores (nearest, both paths; search, explore), items (search, by subtype, by custom type, details), orders (place, my orders). Seeded by `src/seed/medicine.ts` when no medicine store exists |
| Customers | Phone login, profile, logout, demo login |
| Favourites, food, fashion, health care, all care, admin panel | Not yet: still answered by demo mode |
