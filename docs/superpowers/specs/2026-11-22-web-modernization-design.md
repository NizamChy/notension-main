# Web app modernization (apps/web) — design

Date: 2026-11-22
Status: draft, awaiting owner approval

## Why

The owner wants the web code clean and maintainable so later features
(payment gateway, order cancel, notifications, R2 photo upload, BullMQ jobs)
are easier to build. The backend (`apps/api`) already uses the target stack
(TypeScript, Zod contracts). The web app (`apps/web`) is still mostly the old
pattern.

## Where things stand (2026-11-22)

- `apps/web/src`: 499 `.js/.jsx` files and 2 `.ts/.tsx` files. `tsconfig` has
  `allowJs`, `strict`, `checkJs: false`.
- **Data fetching:** 19 hooks in `src/hooks/fetch-data` and `src/hooks/place-order`,
  plus scattered component-level calls. They use axios via `src/lib/apiClient.js`
  (one instance per base URL, `adapter: demoAdapter`). TanStack Query is
  installed and used in about 25 files.
- **Demo adapter:** `src/demo/demoAdapter.js` is an axios adapter. It sends
  requests to the network and answers from `src/demo/modules` data while the
  API is unreachable or the user forces sample data (`src/demo/backendStatus.js`).
  **This is a production feature and must keep working unchanged.**
- **Contracts:** `packages/shared/src/contract/*.ts` has Zod schemas for all 8
  services (allCare, customer, fashion, favourites, food, grocery, healthCare,
  medicine), about 1,300 lines, already used by the API.
- **Redux:** 8 slices in `src/redux` (~1,100 lines), all persisted by
  redux-persist under the localStorage key `persist:root` (version 1, with a
  migration). Used in ~80 component files.
  - Client state: `cart` (food/grocery/medicine items, store info, totals,
    cart start time), parts of `user` (login flag, location, district,
    delivery address), parts of `userChoice` (current/default store,
    current item details), `allCare` selections.
  - Server data cached in Redux: `dashboard`, `product`, `itemsByStore`,
    `doctorInfo`, order lists and addresses in `user`, favourites in
    `userChoice`.
- **Forms:** about 22 forms, all hand-written `useState`.
- **Tests:** 2 unit test files, 1 Playwright smoke test. CI runs lint,
  typecheck, test, build and Playwright.

## Goals

1. Web code in TypeScript (`.ts/.tsx`), module by module, ending with no
   `.js/.jsx` in `apps/web/src` (config files may stay JS).
2. One typed API client built on the shared Zod contracts. Responses are
   typed; the web and API cannot drift silently.
3. All server data through TanStack Query (caching, loading, error, retry,
   invalidation after mutations).
4. Client-only state in small Zustand stores. Redux, react-redux and
   redux-persist removed at the end.
5. Forms on React Hook Form + Zod, reusing shared schemas where they exist.
6. A test safety net that grows with each module.

## Non-goals

- MSW. Dropped by the owner. The demo adapter stays as is.
- Redis/BullMQ and Cloudflare R2. Done later, with the features that need them.
- Visual redesign or behaviour changes. Pages should look and act the same,
  except for bug fixes found on the way (each called out in its PR).
- Backend changes, except contract fixes in `packages/shared` when the real
  response differs from the schema.

## Anti-goals (failure even if it "works")

- A user loses their saved cart, login, location or chosen store after the
  deploy.
- Demo mode stops working when the API is down.
- A long-lived half-migrated state where a module uses both Redux and Zustand
  for the same data.
- Giant PRs nobody can review.

## Approaches considered

- **A. Layer by layer across the whole app** (all TS, then all Zustand, ...).
  Uniform, but each step touches ~500 files, PRs are huge, and stopping midway
  leaves everything half done. Rejected.
- **B. Foundation first, then one module per PR.** Small PRs, each verified on
  prod, safe to pause between PRs. Cost: old and new patterns live side by side
  for a while. **Chosen by the owner.**
- **C. Data and state layer only**, leave UI as JS and forms as they are.
  Fastest, but leaves TS and forms half done, against the "clean code" goal.
  Rejected.

## Design

### PR 1 — Foundation

- **Typed API client** (`src/lib/api/`):
  - Keeps using the existing axios instances from `getApiClient` so the demo
    adapter, cookies (`withCredentials`) and timeout keep working.
  - Thin typed functions per endpoint, e.g.
    `grocery.getStoreItems(params): Promise<GroceryItemsResponse>`, typed from
    the shared Zod schemas (`z.infer`).
  - Validation: parse responses with Zod in development and tests; in
    production use `safeParse` and log a warning instead of throwing, so a
    small schema mismatch never breaks a page.
  - **Endpoints without a shared contract.** `api-endpoint.js` has 91
    endpoints; `packages/shared/src/contract` covers only what `apps/api`
    serves. Endpoints the API does not serve yet (e.g. `public-api/v1/admin/*`
    dashboard/districts/areas/banking outlets, USER patients/appointments/order
    info, anything outside `LIVE_PATHS` in `src/api-endpoints/live.js`) get
    web-only Zod schemas in `src/lib/api/schemas/`. When the API later
    implements an endpoint, its schema moves to `packages/shared` and the API
    uses it too. Existing shared contracts are not loosened for the web.
  - **Demo answers never throw.** Responses produced by the demo adapter are
    always checked with `safeParse` + a dev console warning, never a throwing
    parse, so demo mode cannot break from a schema mismatch. Strict (throwing)
    parse in dev/test applies only to real API responses. Where demo data
    disagrees with a contract (e.g. non-hex ids such as `"GS260001"`), the
    demo data is fixed in that module's PR, not the contract — unless the
    contract is wrong about the real API, which is then a contract fix.
    The typed-client tests assert this per module, so mismatches are listed,
    not hidden.
- **TanStack Query conventions:** a query-key factory per service
  (`queryKeys.grocery.items(storeId, params)`), shared defaults in the existing
  `shared/Providers/QueryProvider`, mutations invalidate the related keys.
- **Zustand stores** (`src/stores/`): `useCartStore`, `useSessionStore`
  (login flag, user info basics, location, district, delivery address),
  `usePreferencesStore` (current/default store per module, current item
  details, all-care selections). Each uses Zustand `persist` with its own
  localStorage key and a version number.
- **Fashion bag included.** Fashion has its own cart in
  `components/FashionLifestyle/context/CartContext.jsx`, saved under the
  localStorage key `"cart"`. `useCartStore` gets a `fashion` section and the
  context becomes a thin wrapper over the store in PR 1, so all carts live in
  one place from the start. The `"cart"` key is a second legacy source for
  the migration.
- **Saved-data migration (no lost carts):** on first load, if the new keys are
  empty and `persist:root` (or the Fashion `"cart"` key) exists, read it, copy
  the client-state parts into the new stores. Client state includes the
  selection fields that live in "server" slices: `itemsByStore`
  `merchantId`/`customstore_id` and `allCare` `currentService`/
  `currentProviderDetails`. Leave the old keys in place until the last PR (so a
  rollback to the old build still finds its data). Server-data parts are not
  copied; TanStack Query refetches them. Covered by unit tests with real
  sample `persist:root` payloads (empty, old v0, v1, full cart in all three
  modules).
- **Bridge while migrating:** until a module is migrated it still reads Redux.
  To avoid two sources of truth, the cart and session move to Zustand in PR 1
  in one go, and Redux `cart`/session reads are replaced by thin hooks
  (`useCart()`, `useSession()`) across all modules. Server-data slices stay in
  Redux until their module PR.
- **Tests added:** cart store logic (port the existing cartReducer tests),
  migration tests, typed-client tests against demo route data, and Playwright
  smoke flows: home → grocery store → add to cart → checkout page; login with
  demo user; health care doctor list. These run before and after every later
  PR.
- **Form helpers:** a small RHF + Zod wrapper (`useZodForm`) and shared field
  components on the existing `shared/UI` tokens.

### PRs 2–8 — One module each

Order: **Grocery → Medicine → Food → Fashion → Health Care (MedicalServices)
→ All Care → Account/Login/Admin** (UserInfoSection, LoginSection,
ShopInfoSection, Admin, Cart, shared, common, StoreModule, LandingPage folded
into the module that owns them or into the last PR).

Each module PR:
1. Renames the module's files to `.ts/.tsx` and fixes types (no `any` except
   at clearly marked boundaries).
2. Replaces its fetch hooks with TanStack Query hooks on the typed client.
3. Removes its Redux server-data slice usage (and the slice when the last
   reader is gone).
4. Moves its forms to RHF + Zod.
5. Adds unit tests for its hooks/helpers and extends the smoke test with its
   main flow.
6. Grocery and Medicine (PRs 2–3): merge the duplicated components into
   shared ones (cleanup list item). Same for any `common/` vs `shared/`
   overlap the module touches.

### PR 9 — Finish

- Remove Redux, react-redux, redux-persist, `src/redux`, PersistGate (this also
  closes the PersistGate SSR-blank cleanup item).
- Delete the old `persist:root` and Fashion `"cart"` keys after the new stores
  have loaded.
- Set `allowJs: false` for `src` (no JS left; config files excluded).
- Update README / guide notes on the new patterns.

### Every PR

- Branch from `dev`, PR to `main`, per the existing workflow (ask before push;
  merge; wait for the prod deploy; verify live in the browser, including demo
  mode with the API forced offline).
- `npx turbo run lint typecheck test build` and Playwright pass.
- Lint warning count does not go up.

## Decided by the owner

- Do items 1–5 now, approach B. MSW dropped.
- Saved-data migration and testing approach left to the builder, with the
  rule: no risk to users' saved data.

## Builder's calls (owner can override)

- Module order above (grocery first because it is the most complete on the
  API and has parity tests).
- Zod parse in dev/test only, warn in prod.
- Keep `persist:root` until PR 9 for rollback safety.
- Store names and folder layout (`src/lib/api`, `src/stores`).
- Exact typing strictness per file is left to the builder, as long as
  typecheck passes with `strict: true`.
- Web-only schemas for endpoints the API does not serve yet, in
  `src/lib/api/schemas/`; moved to `packages/shared` when the API serves them.
- Demo adapter answers are only `safeParse`d (warn, never throw); demo data
  is fixed to match contracts, contracts are not loosened.
- `src/demo` (adapter and data) is converted to TS like everything else, with
  no behaviour change.
- Fashion bag joins `useCartStore` in PR 1.
- Selection fields in `itemsByStore` and `allCare` count as client state and
  are migrated.

## Work split and branch

All work happens on branch `feat/web-modernization` (from `dev`). Each PR in
the plan is a reviewable chunk; the owner decides when each is pushed and
merged.
