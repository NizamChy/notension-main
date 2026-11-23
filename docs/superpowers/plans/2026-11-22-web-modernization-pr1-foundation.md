# Web Modernization — PR 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay the base every module PR builds on: a safety-net test suite, Zustand cart + session stores that take over users' saved data with nothing lost, a typed/validated API request layer, query-key conventions and a form helper.

**Architecture:** New code lives in `apps/web/src/stores` (Zustand + `persist`), `apps/web/src/lib/api` (typed request + Zod validation on top of the existing axios clients and demo adapter) and `apps/web/src/lib/forms`. Cart and session move fully to Zustand in this PR; every reader/writer is switched. Other Redux slices stay until their module PR. All Redux slices stay *registered* (unused ones untouched) so `persist:root` keeps its last contents for rollback until PR 9.

**Tech Stack:** Next 16, React 19, TypeScript 7, Zustand 5, React Hook Form 7 + `@hookform/resolvers`, Zod 4 (`@notension/shared`), TanStack Query 5, Vitest 5 (+ jsdom, @testing-library/react for the form test), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-22-web-modernization-design.md`

## Global Constraints

- Branch `feat/web-modernization`. Commit per task. Do not push; the owner approves push/PR.
- No visual or behaviour change for users. Demo mode (`src/demo`) keeps working, including with the API unreachable.
- Saved data must survive: Redux `persist:root` (version 1, values double-JSON-encoded by redux-persist) and Fashion `localStorage["cart"]`. Neither old key is written to or deleted in this PR.
- Demo adapter answers are only `safeParse`d (warn, never throw). Throwing parse applies to real API responses in dev/test only; production never throws on a schema mismatch.
- Existing shared contracts are not loosened.
- New files are `.ts/.tsx`; files touched only to swap an import may stay `.js/.jsx` (they convert in their module PR).
- Checks: from repo root `npx turbo run lint typecheck test build`, plus `npm run e2e -w web`. Also `npx eslint apps/web/src --rule '{"no-undef":"error"}'`. Lint warning count must not rise above today's (record it in Task 1).

## Review Focus

1. **Corrupt or foreign saved data** (`persist:root` not JSON, a slice value not JSON, Fashion `"cart"` not an array): the app must start with an empty cart/session, not crash. → tests in Task 2.
2. **Storage blocked** (`localStorage` access throws, e.g. some private modes): stores fall back to memory, app renders. → test in Task 2.
3. **Old saved cart lines with odd fields** (missing `max_allowed`, string `sale_price`, `quantity` as string): totals match `lineTotal` from `@/utils/price` like today. → test in Task 3.
4. **Logged-in user before the deploy** stays logged in after it (session migrated from `persist:root.user`); logout still keeps the chosen location and clears the account data in Redux too. → tests in Task 4.
5. **First visit with no saved data**: Dhaka demo default location is still applied before the first render. → e2e in Task 9.

---

### Task 1: Baseline safety-net e2e flows

Written against today's code so later tasks prove they changed nothing.

**Files:**
- Create: `apps/web/e2e/flows.spec.ts`
- Modify: none

**Interfaces:**
- Produces: e2e tests `grocery cart survives reload`, `fashion bag survives reload`, `demo user login shows account`, `doctor list renders` — rerun at the end of every later task that touches UI.

- [ ] **Step 1: Record baseline numbers**

Run from repo root: `npx turbo run lint 2>&1 | grep -E "problems|warning"` and note the warning count for the PR description (keep it in the session scratchpad, not in the repo).

- [ ] **Step 2: Write the flows**

Each test starts with a cleared `localStorage`, forces demo data (`localStorage["notension-sample-data"]="on"` — check `src/demo/backendStatus.js` for the exact value) so it does not depend on the live API.
- `grocery cart survives reload`: open `/grocery`, open the first store, add the first item, expect the cart count badge to show `1`; reload; expect `1` again.
- `fashion bag survives reload`: same on `/fashion-lifestyle` product page → add to bag → reload → bag count `1`.
- `demo user login shows account`: open login popup, click "Log in as Demo User", expect the account/profile entry to be visible; reload; still visible.
- `doctor list renders`: `/medical-services` → first department → at least one doctor card.

Use roles/text selectors; add `data-testid` only where no stable selector exists (allowed small markup change, no visual change).

- [ ] **Step 3: Run against current code**

Run: `npm run e2e -w web -- flows.spec.ts`
Expected: 4 passed.

- [ ] **Step 4: Commit**

```bash
git add apps/web/e2e/flows.spec.ts
git commit -m "test(web): e2e safety net for cart, bag, login and doctors"
```

---

### Task 2: Legacy saved-data reader and safe storage

**Files:**
- Create: `apps/web/src/stores/legacy.ts`, `apps/web/src/stores/storage.ts`
- Test: `apps/web/src/stores/legacy.test.ts`, `apps/web/src/stores/storage.test.ts`

**Interfaces:**
- Produces:
  - `type LegacyRoot = { user?: Record<string, unknown>; cart?: Record<string, unknown>; userChoice?: Record<string, unknown>; itemsByStore?: Record<string, unknown>; allCare?: Record<string, unknown>; [slice: string]: unknown }`
  - `readLegacyRoot(storage: Pick<Storage, "getItem">): LegacyRoot | null` — reads `persist:root`, parses the outer JSON, then each slice string; a slice that fails to parse is dropped; returns `null` when missing or outer JSON is broken. `_persist` key ignored.
  - `readLegacyFashionCart(storage: Pick<Storage, "getItem">): Record<string, unknown>[]` — `localStorage["cart"]`; anything not a JSON array → `[]`.
  - `safeLocalStorage(): Storage` — returns `window.localStorage` if a set/remove probe works, otherwise an in-memory `Storage`; on the server returns the in-memory one.
  - `legacyAwareStorage<T>(key: string, version: number, fromLegacy: (s: Pick<Storage,"getItem">) => T | null): PersistStorage<T>` (Zustand `PersistStorage`) — `getItem(key)` returns the stored value; if nothing is stored, returns `{ state: fromLegacy(storage), version }` when `fromLegacy` gives non-null, else `null`. `setItem/removeItem` write only `key`.

- [ ] **Step 1: Write the failing tests**

`legacy.test.ts` (fake storage = `{ getItem: (k) => map[k] ?? null }`):
- `reads a v1 persist:root` — input `{"user":"{\"isLoggedin\":true}","cart":"{\"groceryItems\":[]}","_persist":"{\"version\":1,\"rehydrated\":true}"}` → `{ user: { isLoggedin: true }, cart: { groceryItems: [] } }`.
- `reads a v0 persist:root without _persist` → same slices.
- `drops a slice that is not JSON` — `{"user":"{oops","cart":"{}"}` → `{ cart: {} }`.
- `returns null for broken outer JSON` (`"not json"`) and for missing key.
- `reads the fashion bag` — `[{"_id":"a","quantity":2}]` → that array.
- `fashion bag: non-array or broken JSON gives []` — `"{}"`, `"oops"`, missing.

`storage.test.ts`:
- `falls back to memory when localStorage throws` — stub `globalThis.window = { localStorage: { setItem() { throw new Error("blocked") }, ... } }`; `safeLocalStorage().setItem("x","1")` does not throw and `getItem("x")` → `"1"`.
- `legacyAwareStorage uses the stored value first` and `falls back to fromLegacy only when the key is empty` and `returns null when both are empty`.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/stores -w web` (or `cd apps/web && npx vitest run src/stores`)
Expected: FAIL, modules not found.

- [ ] **Step 3: Install Zustand and implement both files**

`npm install zustand@^5 -w web`. Implement the signatures above.

- [ ] **Step 4: Run to verify they pass**

Run: `cd apps/web && npx vitest run src/stores`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json package-lock.json apps/web/src/stores
git commit -m "feat(web): legacy saved-data reader and safe storage for Zustand"
```

---

### Task 3: Cart store (grocery, food, medicine, fashion)

**Files:**
- Create: `apps/web/src/stores/cartStore.ts`
- Test: `apps/web/src/stores/cartStore.test.ts` (port every case from `src/redux/__tests__/cartReducer.test.js`, keep the old test file until PR 9)

**Interfaces:**
- Consumes: `legacyAwareStorage`, `readLegacyRoot`, `readLegacyFashionCart` (Task 2); `lineTotal`, `toNumber` from `@/utils/price`.
- Produces:
  - `type CartModule = "grocery" | "food" | "medicine"`
  - `type CartLine = { _id: string; quantity: number; max_allowed?: number; [k: string]: unknown }`
  - `type ModuleCart = { items: CartLine[]; storeInfo: Record<string, unknown>; startAt: number }`
  - `type FashionLine = CartLine & { selectedSize: string | null; selectedImage: string | null; selectedColor: string | null; addedAt: string }`
  - `useCartStore` (Zustand, key `"notension-cart"`, version `1`, `skipHydration: true`) with state `{ grocery: ModuleCart; food: ModuleCart; medicine: ModuleCart; fashion: FashionLine[] }` and actions:
    - `add(m: CartModule, item: Omit<CartLine,"quantity">)`, `remove(m, id: string)`, `increment(m, id)`, `decrement(m, id)`, `clear(m)`, `saveStoreInfo(m, info: Record<string, unknown>)`
    - `fashionAdd(product, quantity = 1, selectedSize = null, selectedImage = null, selectedColor = null)`, `fashionUpdateQuantity(id, qty, selectedSize, selectedImage)`, `fashionRemove(id, selectedSize, selectedImage)`, `fashionClear()`
  - selectors: `cartTotal(c: ModuleCart): number`, `fashionTotal(lines: FashionLine[]): number`, `fashionCount(lines): number`
  - `cartFromLegacy(s: Pick<Storage,"getItem">): CartState | null` — maps `cart.{grocery,food,medicine}Items/StoreInfo/CartStartAt` and the fashion bag; `null` when neither source has anything.

Semantics copied exactly from `src/redux/cartReducer.js` (limit via `max_allowed`, `startAt` set on first add, reset to 0 on clear, decrement from 1 removes) and `FashionLifestyle/context/CartContext.jsx` (line identity = `_id + selectedSize + selectedImage`, quantity < 1 ignored on update). Totals are derived, not stored.

- [ ] **Step 1: Write the failing tests**

Ported reducer cases, plus:
- `fashion: same product with another size is a new line`
- `fashion: update to 0 is ignored`
- `totals use lineTotal for odd legacy lines` — line `{ _id:"x", sale_price:"50", quantity:"2" }` → `cartTotal` equals `lineTotal(line)` (Review Focus 3).
- `migrates a full legacy cart` — `persist:root` with 1 item in each of grocery/food/medicine plus storeInfo and startAt, and a 2-line fashion bag → store after `await useCartStore.persist.rehydrate()` holds all of it.
- `migrates nothing from corrupt data` — broken `persist:root` and `"cart"`=`"{}"` → empty store, no throw (Review Focus 1).
- `prefers notension-cart over legacy` once it exists.

Reset the store between tests with `useCartStore.setState(initial, true)` and a fresh fake storage passed via `useCartStore.persist.setOptions({ storage })`.

- [ ] **Step 2: Run to verify they fail**

Run: `cd apps/web && npx vitest run src/stores/cartStore.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `cartStore.ts`**

- [ ] **Step 4: Run to verify they pass**

Expected: all pass, and `src/redux/__tests__/cartReducer.test.js` still passes.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/stores/cartStore.ts apps/web/src/stores/cartStore.test.ts
git commit -m "feat(web): Zustand cart store with legacy cart and fashion bag migration"
```

---

### Task 4: Session store and logout

**Files:**
- Create: `apps/web/src/stores/sessionStore.ts`, `apps/web/src/stores/logout.ts`
- Test: `apps/web/src/stores/sessionStore.test.ts`

**Interfaces:**
- Consumes: Task 2 helpers; `store` + `handleUserReducer` from `@/redux` (for logout bridging).
- Produces:
  - `type UserLocation` = the shape saved today by `SAVE_USER_CURRENT_LOCATION` (see `src/utils/userLocation.js`, `src/demo/demoLocations.js`).
  - `useSessionStore` (key `"notension-session"`, version `1`, `skipHydration: true`) with state `{ isLoggedin: boolean; userInfo: Record<string, unknown>; currentUserLocation: UserLocation | Record<string, never>; userLatitude: string; userLongitude: string; districtId: string; deliveryAddress: string }`, defaults matching `src/redux/userReducer.js` (`"00"` for lat/lng/district).
  - actions: `login(userInfo)`, `saveLocation(loc: UserLocation)` (same field derivation as `SAVE_USER_CURRENT_LOCATION`), `clearAccount()` (resets `isLoggedin`/`userInfo`, keeps location fields and `deliveryAddress`).
  - `sessionFromLegacy(s): SessionState | null` — from `persist:root.user`.
  - `logout(): void` in `logout.ts` — `useSessionStore.getState().clearAccount()` then `store.dispatch(handleUserReducer({ type: "LOGOUT_USER" }))` (clears orders/patients/appointments still held in Redux).

- [ ] **Step 1: Write the failing tests**

- `saveLocation derives lat/lng/district, "00" when missing`
- `clearAccount keeps location and delivery address`
- `migrates a logged-in legacy user` — `persist:root.user` = `{ isLoggedin: true, userInfo: { name: "A" }, districtId: "1", currentUserLocation: {...} }` → rehydrated store equal (Review Focus 4).
- `logout clears session and dispatches LOGOUT_USER` — spy on `store.dispatch`.

- [ ] **Step 2: Run to verify they fail** — `cd apps/web && npx vitest run src/stores/sessionStore.test.ts` → FAIL.
- [ ] **Step 3: Implement both files.**
- [ ] **Step 4: Run to verify they pass.**
- [ ] **Step 5: Commit** — `feat(web): Zustand session store and shared logout`

---

### Task 5: Hydrate stores before first render

**Files:**
- Modify: `apps/web/src/redux/ReduxProvider.jsx` (→ rename to `.tsx`), `apps/web/src/demo/installDemoMode.js`

**Interfaces:**
- Consumes: `useCartStore`, `useSessionStore`.
- Produces: `hydrateStores(): Promise<void>` exported from `apps/web/src/stores/hydrate.ts` — rehydrates both stores; called inside PersistGate `onBeforeLift` *before* `applyDemoDefaults`, so nothing renders until both Redux and Zustand are loaded (same timing as today; no hydration mismatch).

- [ ] **Step 1:** Create `hydrate.ts`; in `ReduxProvider`, `onBeforeLift={async () => { await hydrateStores(); applyDemoDefaults(); }}`.
- [ ] **Step 2:** `applyDemoDefaults` reads/writes `useSessionStore` (`currentUserLocation?.districtId` empty → `saveLocation(toUserLocation(DEFAULT_DEMO_LOCATION))`) instead of Redux.
- [ ] **Step 3:** Run `npx turbo run typecheck test` → pass.
- [ ] **Step 4: Commit** — `feat(web): hydrate Zustand stores with redux-persist before render`

---

### Task 6: Switch every cart reader and writer

**Files:**
- Create: `apps/web/src/stores/useModuleCart.ts`
- Modify: the 6 files dispatching `handleCartAction` and the 13 reading `state.cart` (find with `grep -rln "handleCartAction\|state\??\.cart" apps/web/src --include=*.js* | grep -v src/redux/`), and `apps/web/src/components/FashionLifestyle/context/CartContext.jsx`.

**Interfaces:**
- Consumes: Task 3.
- Produces: `useModuleCart(m: CartModule): { items; storeInfo; startAt; total; add; remove; increment; decrement; clear; saveStoreInfo }` (actions pre-bound to `m`, `total = cartTotal(...)`). Fashion keeps its public `useCart()` API unchanged: `CartContext` becomes a thin wrapper reading `useCartStore` (`cartItems`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `getCartTotal`, `getCartCount`, `isInitialized` = `useCartStore.persist.hasHydrated()`), and no longer reads/writes `localStorage["cart"]`.

Old Redux field → new: `groceryItems` → `items`, `groceryStoreInfo` → `storeInfo`, `totalAmountGrocery` → `total`, `groceryCartStartAt` → `startAt` (same for food/medicine). Action `ADD_TO_CART_X` → `add`, `REMOVE_ITEM_X` → `remove(id)`, `INCREMENT_QUANTITY_X` → `increment(id)`, `DECREMENT_QUANTITY_X` → `decrement(id)`, `CLEAR_CART_X` → `clear()`, `SAVE_X_STORE_INFO` → `saveStoreInfo`. Keep `addToCart` returning `false` while the store-switch prompt is open (flyToCart relies on it).

- [ ] **Step 1:** Switch files one module at a time.
- [ ] **Step 2: Verify none left** — `grep -rn "handleCartAction\|state\??\.cart" apps/web/src --include=*.js* --include=*.ts* | grep -v "src/redux/"` → no output. The `cart` slice stays registered in `src/redux/store.js` (rollback data).
- [ ] **Step 3:** `npx turbo run lint typecheck test` and `npm run e2e -w web` → all pass (Task 1 flows included).
- [ ] **Step 4: Commit** — `refactor(web): cart reads and writes go through the Zustand cart store`

---

### Task 7: Switch every session reader and writer

**Files:**
- Modify: files reading `state.user.{isLoggedin,userInfo,currentUserLocation,userLatitude,userLongitude,districtId,deliveryAddress}` or destructuring those from `useSelector((state) => state.user)` (≈59 files read `state.user`; only these fields move), writers in `hooks/fetch-data/useUser.js`, `components/shared/Map/LocationPicker.jsx`, `components/DemoMode/DemoModeToggle.jsx`, `hooks/place-order/useOrderFood.js`, `hooks/place-order/useOrderGrocery.js`, `utils/userLocation.js`.

**Interfaces:**
- Consumes: Task 4. Reads use `useSessionStore((s) => s.field)` (one selector per field, or `useShallow` for several). `SAVE_LOGGEDIN_INFO` → `login`, `SAVE_USER_CURRENT_LOCATION` → `saveLocation`, `LOGOUT_USER` → `logout()` from `@/stores/logout`.
- Server-data fields (`groceryOrderInfo`, `medicineOrderInfo`, `foodOrderInfo`, `patientInfo`, `bookedAppoinmentInfo`, `allAddress`) stay on Redux.

- [ ] **Step 1:** Switch writers, then readers.
- [ ] **Step 2: Verify none left** — `grep -rnE "state\??\.user\??\.(isLoggedin|userInfo|currentUserLocation|userLatitude|userLongitude|districtId|deliveryAddress)" apps/web/src | grep -v src/redux/` → no output; and review each remaining `useSelector((state) => state.user)` destructure by hand for these names.
- [ ] **Step 3:** full checks + e2e → pass.
- [ ] **Step 4: Commit** — `refactor(web): session and location go through the Zustand session store`

---

### Task 8: Typed request layer, demo marker, query keys

**Files:**
- Create: `apps/web/src/lib/api/validate.ts`, `apps/web/src/lib/api/request.ts`, `apps/web/src/lib/api/queryKeys.ts`, `apps/web/src/lib/api/schemas/README.md` (one paragraph: web-only schemas live here until the API serves the endpoint, then move to `packages/shared`)
- Modify: `apps/web/src/demo/demoAdapter.js` (add header `"x-notension-source": "demo"` to demo responses only), `apps/web/src/components/shared/Providers/QueryProvider.jsx` → `.tsx` (types only)
- Test: `apps/web/src/lib/api/validate.test.ts`, `apps/web/src/demo/demoAdapter.test.ts`

**Interfaces:**
- Produces:
  - `type Source = "live" | "demo"`
  - `validate<S extends z.ZodType>(schema: S, data: unknown, ctx: { source: Source; endpoint: string; mode?: "strict" | "warn" }): z.infer<S>` — `mode` defaults to `"strict"` when `process.env.NODE_ENV !== "production"` and source is `"live"`, else `"warn"`. Strict throws a `ContractError` (exported, holds `endpoint` + Zod issues); warn calls `console.warn` once per endpoint and returns `data` as-is.
  - `type Service = "GROCERY" | "MEDICINE" | "FOOD" | "FASHION" | "HEALTH_CARE" | "ALL_CARE" | "USER" | "ALL_DISTRICTS"`
  - `apiGet<S>(service: Service, path: string, schema: S, params?: Record<string, unknown>): Promise<z.infer<S>>` and `apiPost<S>(service, path, body: unknown, schema: S): Promise<z.infer<S>>` — use `getApiClient(<URL for service>)` from `@/lib/apiClient` (so demo adapter, cookies, timeout stay), read `response.headers["x-notension-source"]` to pick the source.
  - `queryKeys` object: `queryKeys.<service>.<entity>(...args)` returning readonly tuples rooted at the service name, e.g. `queryKeys.grocery.store(storeId) => ["grocery", "store", storeId] as const`. Ship only `grocery` and `user` roots now; module PRs add theirs.

- [ ] **Step 1: Write the failing tests**
  - `strict mode throws ContractError on a live mismatch` (schema `z.object({ id: z.string() })`, data `{ id: 1 }`).
  - `demo answers never throw` — same data, `source: "demo"`, NODE_ENV test → returns data, `console.warn` called once.
  - `production never throws` — set `mode: "warn"` path via NODE_ENV=production stub.
  - `demo adapter marks its answers` — force sample data, call a known demo route through `getApiClient(GROCERY_URL)`, expect header `x-notension-source` = `"demo"`.
- [ ] **Step 2: Run** — `cd apps/web && npx vitest run src/lib/api src/demo` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** → pass; full checks pass.
- [ ] **Step 5: Commit** — `feat(web): typed request layer with contract validation and query keys`

---

### Task 9: Form helper, migration e2e, PR notes

**Files:**
- Create: `apps/web/src/lib/forms/useZodForm.ts`, `apps/web/src/components/shared/UI/FormField.tsx`
- Modify: `apps/web/vitest.config.ts` (allow `environment: "jsdom"` per file via `// @vitest-environment jsdom`), `apps/web/e2e/flows.spec.ts`
- Test: `apps/web/src/lib/forms/useZodForm.test.tsx`

**Interfaces:**
- Produces:
  - `useZodForm<S extends z.ZodType>(schema: S, options?: Omit<UseFormProps<z.infer<S>>, "resolver">): UseFormReturn<z.infer<S>>` — `useForm` with `zodResolver(schema)`, `mode: "onTouched"` default.
  - `<FormField label: string; error?: string; children />` — label + child input + error text, styled with existing `shared/UI` tokens (no new colours; dark mode works through existing CSS variables).

- [ ] **Step 1: Install** — `npm install react-hook-form@^7 @hookform/resolvers -w web` and `npm install -D jsdom @testing-library/react -w web`.
- [ ] **Step 2: Failing test** — `shows the Zod message after an invalid submit`: schema `customer` phone schema from `@notension/shared` (message `"Enter a valid mobile number (01XXXXXXXXX)"`), render a tiny form with `FormField`, submit `"123"`, expect that text.
- [ ] **Step 3: Implement**, run → pass.
- [ ] **Step 4: Migration + first-visit e2e** (Review Focus 1, 4, 5) in `flows.spec.ts`:
  - `old saved cart is kept` — `addInitScript` seeds a v1 `persist:root` with one grocery item and a fashion `"cart"` with one line; open `/grocery` → cart badge `1`; `/fashion-lifestyle` → bag `1`.
  - `old login is kept` — seeded `persist:root.user` logged in → account entry visible.
  - `broken saved data does not crash` — `persist:root` = `"oops"`, `"cart"` = `"{}"` → home renders, no page errors.
  - `first visit gets Dhaka` — empty storage → location label shows Dhaka.
- [ ] **Step 5: Full verification** — `npx turbo run lint typecheck test build`, `npx eslint apps/web/src --rule '{"no-undef":"error"}'`, `npm run e2e -w web`; lint warnings ≤ baseline. Manually in the browser (dev server): demo mode with the API forced offline, add to cart in grocery/food/medicine/fashion, login/logout, change location.
- [ ] **Step 6: Commit** — `feat(web): RHF + Zod form helper and saved-data migration e2e`

Then stop and ask the owner before pushing / opening the PR to `main` (workflow: PR → merge → wait for prod deploy → verify live, including a browser that has an old cart saved).

---

## Roadmap after PR 1 (each gets its own short plan when it starts)

| PR | Scope | Notes |
|----|-------|-------|
| 2 ✅ | Grocery (done, see `2026-11-22-web-modernization-pr2-grocery.md`) | TS, TanStack Query on `apiGet` + `groceryItems`/`store` keys, drop its `itemsByStore`/`dashboard`/`product` reads, forms → RHF, migrate grocery selection fields from `userChoice`/`itemsByStore` into a new `usePreferencesStore` (key `notension-preferences`, legacy reader from Task 2), shared components extracted for reuse by Medicine |
| 3 ✅ | Medicine (done, see `2026-11-23-web-modernization-pr3-medicine.md`) | reuse PR 2 shared components (Grocery↔Medicine duplication cleanup) |
| 4 ✅ | Food (done, see `2026-11-23-web-modernization-pr4-food.md`) | data layer typed + TanStack Query; Food UI components still .jsx (follow-up) |
| 5 ✅ | Fashion (done, see `2026-11-23-web-modernization-pr5-fashion.md`) | typed API on the `fashion` contract; wishlist from `userChoice` → `useWishlistStore` (`notension-wishlist`); `currentProductDetails` → query cache |
| 6 ✅ | Health Care (done, see `2026-11-23-web-modernization-pr6-healthcare.md`) | typed API on the `healthCare` contract + TanStack Query; `doctorInfo` slice unused; patients/appointments → `useHealthStore` (`notension-health`); booking URL carries `?doctor=&center=`; UTC date bug fixed (`parseLocalYMD`) |
| 7 ✅ | All Care (done, see `2026-11-23-web-modernization-pr7-allcare.md`) | typed API + TanStack Query; selected service/provider come from the URL, so no preferences field was needed |
| 8 | Account / Login / Admin / shared / common / StoreModule / LandingPage | `user` server fields, favourites, `common/` vs `shared/` overlap |
| 9 | Finish | remove Redux, redux-persist, PersistGate (SSR blank fix), delete `persist:root` + `"cart"`, `allowJs: false` |

Spec deviation (builder's call): the spec lists `usePreferencesStore` in PR 1. It moves to PR 2 because its fields are only read by module code, and each store migrates independently from `persist:root` (kept until PR 9), so there is never two sources of truth for a field.
