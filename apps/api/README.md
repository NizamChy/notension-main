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

Demo mode stays on; listed services skip demo data and call the API:

```bash
# apps/web/.env.local
NEXT_PUBLIC_LIVE_SERVICES=GROCERY
NEXT_PUBLIC_GROCERY_URL=http://localhost:4000
```

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | (none: PGlite) | Postgres connection string |
| `PGLITE_DIR` | `./.pglite` | Where PGlite keeps its data |
| `PORT` | `4000` | HTTP port |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated browser origins |

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
- IDs are 24-character hex strings, the format the web app's URLs and saved
  carts already use.

## Tests

`npm run test -w api` runs the parity tests: every grocery endpoint gets the
same requests as the web app's demo mode, the two responses must match, and
each API response is checked against the shared contract. They use an
in-memory PGlite database, so they need nothing installed.

## Status

| Module | Endpoints |
| --- | --- |
| Grocery | Stores (nearest, search, explore), items (search, by subtype, by custom type, details) |
| Grocery orders, medicine, food, fashion, health care, all care, users | Not yet: still answered by demo mode |
