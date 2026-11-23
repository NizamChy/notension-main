# Web Modernization — PR 2 (Grocery) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Grocery module to TypeScript, TanStack Query on the typed client, and RHF for its form. Stop it from reading or writing the Redux `dashboard`, `itemsByStore`, `product` and `userChoice.currentItemDetails` data. Add `usePreferencesStore`. Extract the Grocery/Medicine duplicates into config-driven shared components that Medicine adopts in PR 3.

**Architecture:** Grocery server data comes from query hooks in `apps/web/src/hooks/grocery/`, built on typed functions in `apps/web/src/lib/api/grocery.ts` (`apiGet`/`apiPost` plus the shared `grocery` contract). The store being viewed is found from the URL (`storeId`, `customStoreId`), not from Redux. The store-module components shared with Medicine (`components/StoreModule`) read store data through one bridge hook, `useStoreData(moduleName)`: Grocery uses the query, Medicine keeps using Redux until PR 3. So no field ever has two sources. The one client selection field Grocery still needs, `dashboard.currentModule`, moves to a new persisted `usePreferencesStore`.

**Tech Stack:** Next 16, React 19, TypeScript 7, TanStack Query 5, Zustand 5, React Hook Form 7 + Zod 4 (`@notension/shared`), Vitest (+ jsdom, @testing-library/react), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-22-web-modernization-design.md` (PR 2 row in `docs/superpowers/plans/2026-11-22-web-modernization-pr1-foundation.md`, "Roadmap after PR 1")

## Global Constraints

- Branch `feat/web-modernization-grocery` (from `feat/web-modernization`; rebase on `main` once PR 1 is merged). Commit per task. Do not push; the owner approves push/PR.
- No visual or behaviour change for users. Any bug fixed along the way is called out in the PR body.
- Demo mode (`src/demo`) keeps working, including with the API unreachable. Demo answers are only `safeParse`d (warn, never throw). If demo data disagrees with the contract, fix the demo data, not the contract.
- Existing shared contracts are not loosened. Web-only schemas go in `apps/web/src/lib/api/schemas/`.
- Saved data must survive: `persist:root` stays registered and untouched (rollback data until PR 9). The new key `notension-preferences` seeds from it on first load.
- Medicine, Food and Fashion behave exactly as before. Files of theirs touched only to swap an import or a hook stay `.js/.jsx`.
- New and converted Grocery files are `.ts/.tsx` with `strict` types. `any` is allowed only at marked boundaries (`// boundary: legacy JS caller`).
- Favourites (`userChoice.favourite*`) stay in Redux; they move in PR 8.
- Checks: from the repo root `npx turbo run lint typecheck test build`, `npm run e2e -w web`, `npx eslint apps/web/src --rule '{"no-undef":"error"}'`. The lint warning count must not go above the Task 1 baseline.

## Review Focus

1. **Bumping a store version without a hydration guard.** `hydrateStores` calls `setState({})` after rehydrating. If a rehydrate drops the saved state (for example a version bump with no `migrate`), that write replaces the user's saved `notension-*` key with the initial state. Expected: a store writes back only when its own key was empty before the rehydrate, so only a legacy migration is written. → test in Task 3.
2. **Stale Redux store ids after a Medicine or Food visit.** Grocery no longer writes `itemsByStore.merchantId`/`customstore_id`, but Medicine and Food still do. Any Grocery path that still read them would send the other module's store id. Expected: every Grocery request takes the store from the URL. → test in Task 4 (favourites take an explicit store ref) and the e2e in Task 8 (visit Medicine, then Grocery, then add a favourite and search).
3. **Direct link or reload on a product page.** There is no list click, so nothing is seeded. Expected: the item is fetched by id, with "not found" for an unknown id, as today. → e2e in Task 8.
4. **Closed, inactive, banned or missing store.** Expected: `StoreUnavailable` with `"closed"` or `"missing"`, exactly as `useGroceryShop.exploreStore` decides today. → test in Task 2.
5. **Old saved `dashboard.currentModule`.** The cart drawer and the after-login redirect depend on it. Expected: a user who was in Food before the deploy is still in Food after it; broken data gives `"dashboard"`. → tests in Task 3.

---

### Task 1: Baseline and Grocery e2e safety net

Written against today's code so later tasks prove they changed nothing.

**Files:**
- Create: `apps/web/e2e/grocery.spec.ts`

**Interfaces:**
- Produces: e2e tests rerun at the end of every later task: `store home shows sections`, `type and sub-type pages list items`, `search finds items`, `product direct link renders and unknown id shows not found`, `checkout shows the cart store and places a demo order`, `orders list shows the placed order`, `closed store shows unavailable`.

- [ ] **Step 1: Record baseline numbers** — `npx turbo run lint 2>&1 | grep -E "problems|warning"`. Keep the count in the session scratchpad.
- [ ] **Step 2: Write the flows.** Use the same setup as `e2e/flows.spec.ts`: cleared storage and forced sample data. Use the demo store `Gulshan Fresh Mart` (`_id 6650a00100000000000000a1`, `GS260001`). Steps:
  - Store home: the Special Offer, Deal of The Day and Popular Items headings are visible, plus at least one category in the sidebar (`lg` viewport).
  - Type page: open the first category, then expect at least one item card. Same for the first sub-type.
  - Search: type 2+ letters of a demo product title, then expect it to be listed. Type `zzzz`, then expect the not-found text.
  - Product: go straight to `/grocery/<slug>/<storeId>/<custom>/product/<itemId>`, then expect the title. Use a bad id, then expect the current not-found text.
  - Checkout: add an item, open checkout, log in as the demo user, then expect the store name. Place the order, then expect the "Order placed successfully" toast and the redirect to the store home.
  - Orders: open `orders`, then expect the order id `GRO-…` from the previous step.
  - Closed store: pick a demo store with `is_closed: true` (add one to `demo/modules/grocery/data.js` only if none exists, and note it in the commit), then expect `StoreUnavailable`.
- [ ] **Step 3: Run** — `npm run e2e -w web -- grocery.spec.ts`. Expected: all pass on today's code.
- [ ] **Step 4: Commit** — `test(web): grocery e2e safety net`

---

### Task 2: Typed Grocery API and query keys

**Files:**
- Create: `apps/web/src/lib/api/grocery.ts`, `apps/web/src/lib/api/grocery.test.ts`
- Modify: `apps/web/src/lib/api/queryKeys.ts`, `apps/web/src/demo/modules/grocery.js` and `grocery/data.js` (data fixes only, if the test finds mismatches)

**Interfaces:**
- Consumes: `apiGet`, `apiPost` (`lib/api/request.ts`); `grocery` contract from `@notension/shared` (`groceryExplore`, `groceryNearbyStore`, `groceryStore`, `groceryItem`, `order`, `ok`, `PAGE_SIZE`).
- Produces:
  - `type StoreRef = { storeId: string; customStoreId: string }`
  - `type StoreStatus = "closed" | "missing" | null`
  - `storeStatusOf(explore: GroceryExplore | undefined): StoreStatus`. Same rule as `useGroceryShop.exploreStore`: if the first shop is closed, inactive or banned, it gives `"closed"` when the shop has an `_id` and `"missing"` when it does not. Otherwise it gives `null`.
  - `getNearestStores(loc: { lat: string; lng: string; districtId: string }): Promise<GroceryNearbyStore[]>`. POST `NEAREST_GROCERY_STORE` with body `{ shop_longitude, shop_latitude, max_distance: 1000, districtId }`, exactly as today.
  - `searchStores(text: string): Promise<GroceryStore[]>`
  - `exploreStore(ref: StoreRef): Promise<GroceryExplore>` (params `storeId`, `custom_store_id`)
  - `type ItemListQuery = { kind: "search"; text: string } | { kind: "sub-type"; id: string } | { kind: "custom-type"; id: string }`
  - `getItemPage(ref: StoreRef, q: ItemListQuery, page: number): Promise<GroceryItem[]>`. Uses today's endpoints and params (`groceryStoreId`, `custom_store_id`, `page`, plus `search` / `productSubtype` / `customType`).
  - `getItem(ref: StoreRef, productId: string): Promise<GroceryItem | null>`. Gives `null` when `success` is false.
  - `placeOrder(body: unknown): Promise<{ success: boolean; message?: string }>`. The body is passed through unchanged; checkout still builds it.
  - `getOrders(customer: { _id: string; custom_id?: string }): Promise<Order[]>`
  - `queryKeys.grocery`: `nearest(districtId, lat, lng)`, `searchStores(text)`, `store(storeId, customStoreId)` (replaces the PR 1 one-argument `store`; update its only test), `items(storeId, q: ItemListQuery)`, `item(storeId, productId)`, `orders(customerId)`.
  - The order response schema is web-only (`lib/api/schemas/groceryOrder.ts`: `z.object({ success: z.boolean(), message: z.string().optional() }).passthrough()`), because demo orders do not carry the full `order` shape.

- [ ] **Step 1: Write the failing tests** (`grocery.test.ts`, force sample data, call through the real `getApiClient` and demo adapter):
  - `every demo grocery answer matches the contract`. Call each function above for the demo store and spy on `console.warn`. Expect no warnings. If one appears, fix the demo data in this task (spec rule).
  - `storeStatusOf`: `is_closed` → `"closed"`; `is_active: false` with no `_id` → `"missing"`; open → `null`; `undefined` → `null` (Review Focus 4).
  - `getItemPage sends today's params`: spy on the axios `get` and assert the param names for each `kind`.
  - `getItem returns null for an unknown id`.
- [ ] **Step 2: Run** — `cd apps/web && npx vitest run src/lib/api/grocery.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** the functions and keys.
- [ ] **Step 4: Run.** Expected: pass, and `validate.test.ts` still passes.
- [ ] **Step 5: Commit** — `feat(web): typed grocery API on the shared contract`

---

### Task 3: Preferences store, hydration guard, current module

**Files:**
- Create: `apps/web/src/stores/preferencesStore.ts`, `apps/web/src/stores/preferencesStore.test.ts`
- Modify: `apps/web/src/stores/hydrate.ts`, `hydrate.test.ts`, `resetForSampleSwitch.ts`, `resetForSampleSwitch.test.ts`. Also every reader and writer of `dashboard.currentModule`: `components/Cart/Cart.jsx`, `hooks/useAfterLogin.js`, and the `SET_CURRENT_MODULE` / `VISITED_FOOD_STORE` dispatches in `hooks/fetch-data/{useGroceryShop,useMedicine,useFood,favorite-shop,favorite-list,useDoctor,useAllCareService}.js` (find them with `grep -rn "currentModule\|SET_CURRENT_MODULE\|VISITED_FOOD_STORE" apps/web/src | grep -v src/redux/`).

**Interfaces:**
- Consumes: `legacyAwareStorage`, `readLegacyRoot` (PR 1).
- Produces:
  - `type ModuleName = string`. The values seen today are `"dashboard"`, `"Grocery"`, `"Medicine"`, `"Food"` and the ones set by doctor and all-care. Keep the exact strings, because `Cart` and `useAfterLogin` call `.toLowerCase()` on them.
  - `usePreferencesStore` (key `"notension-preferences"`, version `1`, `skipHydration: true`). State: `{ currentModule: string }`, default `"dashboard"`. Action: `setCurrentModule(m: string)`.
  - `preferencesFromLegacy(s): PreferencesState | null`. Reads `persist:root.dashboard.currentModule` when it is a non-empty string, otherwise `null`. PR 7 adds the all-care fields here.
  - `hydrateStores()` also rehydrates `usePreferencesStore`. Each store writes back (`setState({})`) **only if its own key was empty before the rehydrate**. That is the legacy-migration case; Review Focus 1. A store with a saved key is never rewritten during hydration.
  - `resetForSampleSwitch()` also resets preferences to the initial state. Today `persistor.purge()` resets `dashboard.currentModule` the same way.
  - `VISITED_FOOD_STORE` keeps saving `visitedFoodStore` in Redux (Food, PR 4) and also calls `setCurrentModule("Food")`.

- [ ] **Step 1: Write the failing tests**
  - `migrates currentModule from persist:root` (`dashboard` slice `{"currentModule":"Food"}` gives `"Food"`); `ignores a broken dashboard slice` (default `"dashboard"`) (Review Focus 5).
  - `hydrate does not rewrite a saved key`. Seed `notension-cart` with a state whose `version` is 0 while the store expects 1, with no `migrate`. Spy on storage `setItem`. After `hydrateStores()`, expect no `setItem("notension-cart", …)` call.
  - `hydrate writes a migrated key once`. Use an empty `notension-preferences` and a legacy `persist:root`. Expect exactly one `setItem("notension-preferences", …)`.
  - `sample switch resets currentModule`.
- [ ] **Step 2: Run** — `cd apps/web && npx vitest run src/stores`. Expected: FAIL.
- [ ] **Step 3: Implement** the store and the hydrate change. Read `storage.getItem(key) == null` for each store before calling `rehydrate`. Then switch every `currentModule` reader and writer.
- [ ] **Step 4: Verify none left.** `grep -rn "currentModule" apps/web/src | grep -v -e src/redux/ -e src/stores/` lists only `usePreferencesStore` uses. The `dashboard` slice stays registered.
- [ ] **Step 5:** `npx turbo run lint typecheck test` and `npm run e2e -w web`. Expected: pass, including the PR 1 flows and Task 1.
- [ ] **Step 6: Commit** — `feat(web): preferences store for the current module, write-back only after migration`

---

### Task 4: Grocery query hooks

**Files:**
- Create: `apps/web/src/hooks/grocery/{useStoreRef.ts,useGroceryStore.ts,useGroceryStores.ts,useGroceryItemList.ts,useGroceryItem.ts,useGroceryOrders.ts,usePlaceGroceryOrder.ts,useGroceryCart.ts}`, `apps/web/src/hooks/grocery/hooks.test.tsx`
- Modify: `apps/web/src/hooks/fetch-data/favorite-item.js` (optional store ref)

**Interfaces:**
- Consumes: Task 2 functions and keys; `useModuleCart`, `useSessionStore`, `requestStoreSwitch`, `notify`, `logout`, `orderTotals` (unchanged).
- Produces:
  - `useStoreRef(): StoreRef | null`. Built from `useParams()` `storeId` and `customStoreId`.
  - `useGroceryStore(): { explore?: GroceryExplore; store?: GroceryStore; status: StoreStatus; isLoading: boolean }`. Uses `useQuery(queryKeys.grocery.store(...))` and is enabled only with a ref. `store` is `explore.ShopDetails[0]` when `status === null`.
  - `useNearestGroceryStores()` (session lat, lng and district) and `useGrocerySearchStores(text)` (enabled when `text.length > 1`), each returning `{ stores: GroceryStore[]; isLoading: boolean }`.
  - `useGroceryItemList(q: ItemListQuery | null)`. Uses `useInfiniteQuery`. `getNextPageParam` stops when a page has fewer than `PAGE_SIZE` items. It returns `{ items, isLoading, notFound, hasMore, loadMore }`, the same flags `useGroceryProduct` gives today (`itemNotfound`, `allLoaded`, `loadingMore`). The newest query wins because the key changes; this replaces `searchSeq`.
  - `useGroceryItem(productId)`. Uses `useQuery(queryKeys.grocery.item(storeId, productId))`. `seedGroceryItem(qc: QueryClient, storeId, item)` is called on a list click instead of dispatching `SAVE_CURRENT_ITEM_DETAILS`.
  - `useGroceryOrders()`. Uses `useQuery(queryKeys.grocery.orders(userInfo._id))` and is enabled when logged in.
  - `usePlaceGroceryOrder()`. Has the same return shape as today's `useOrderGrocery` (`progressing`, `placeOrder`, `shippingCharge`, `discount`, `grandTotal`) and keeps its behaviour: ignores a repeat click while in flight; on success shows the toast, clears the cart, dispatches legacy `CLEAR_CART_GROCERY`, invalidates `orders`, and routes to the store home; a 401 means logout plus the toast; other errors use `errorMessage`.
  - `useGroceryCart()`. Has the same API as `useGroceryItems` (`addToCart` returns `false` while the store-switch prompt is open, `incrementQty`, `decrementQty`, `getCurrentQty`, `removeFromCart`). It takes the visited store from `useGroceryStore().store`.
  - `useFavouriteItem(storeRef?: { merchantId: string; customstore_id: string })`. When a ref is given, it is used instead of `state.itemsByStore`. Medicine calls it with no argument, as today.

- [ ] **Step 1: Write the failing tests** (`// @vitest-environment jsdom`, `renderHook` inside a fresh `QueryClientProvider`, forced sample data, `next/navigation` mocked with the demo store params):
  - `useGroceryStore loads the demo store`; `gives "closed" for a closed store`.
  - `useGroceryItemList pages until a short page`. A sub-type with more than 24 demo items gives `hasMore` true, then false after `loadMore`. Use a smaller fixture through `vi.mock` if the demo data has no such sub-type.
  - `useGroceryItem uses seeded data without a request`. Seed it, spy on axios, and expect no call.
  - `useGroceryCart refuses an item from another store`. With the cart `storeInfo._id` set to another id, `addToCart` returns `false`.
  - `useFavouriteItem uses the given store ref`. Put a different `merchantId` in Redux and assert that the request params use the ref (Review Focus 2).
  - `usePlaceGroceryOrder ignores a second click in flight`.
- [ ] **Step 2: Run** — `cd apps/web && npx vitest run src/hooks/grocery`. Expected: FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run.** Expected: pass.
- [ ] **Step 5: Commit** — `feat(web): grocery query hooks on the typed client`

---

### Task 5: Store data bridge and the Grocery store pages

**Files:**
- Create: `apps/web/src/components/StoreModule/useStoreData.ts`
- Modify: the `StoreModule` readers of `state.dashboard` / `state.itemsByStore`: `CategoryBannerCarousel.jsx`, `CustomTypeItems.jsx`, `CustomTypeSection.jsx`, `StoreCategoryDrawer.jsx`, `StoreCategorySidebar.jsx`, `StoreHome.jsx`, `TypeSection.jsx`, `storeModules.js`. Also `components/ShopInfoSection/ShopInfo.jsx`, `components/Cart/Cart.jsx` and `cartModules.js` (`useItems: useGroceryCart`, `useOrder: usePlaceGroceryOrder`, and a per-module `useVisitedStore` in place of `visitedStoreKey`). Also `app/grocery/[store]/layout.js` → `.tsx`, `components/Grocery/GrocerySection/GrocerySection.jsx`, and `StoreModule/SearchedStores.jsx` (`useShop` → `useStores`).
- Delete: `hooks/fetch-data/useGroceryShop.js`, `useGroceryItems.js`.

**Interfaces:**
- Consumes: Task 4 hooks.
- Produces: `useStoreData(moduleName: "grocery" | "medicine"): StoreData`, where
  `StoreData = { store: Record<string, unknown>; typeInfo: TypeInfo[]; typeInfoByShop; subtypeInfoByShop; slider: unknown[]; showProductPrice: boolean; specialOfferItem: unknown[]; dealOfTheDay: unknown[]; popularItem: unknown[]; storeRef: { merchantId: string; customstore_id: string }; isLoading: boolean }`.
  - For grocery, it derives these from `useGroceryStore().explore` with a pure `toStoreData(explore)`. That function copies the `EXPLORE_STORE` and `EXPLORE_STORE_ITEMS` reducer cases exactly: the `typeInfo` mapping with `image: "medical_equipment.png"`, `subtype` only for `statusType === "General"`, and `showProductPrice` defaulting to `true`.
  - For medicine, it reads the same fields from Redux (`dashboard`, `itemsByStore`), unchanged until PR 3.
  - The `STORE_MODULES` entry gains `useStores` (grocery: `{ nearest: useNearestGroceryStores, search: useGrocerySearchStores }`; medicine: an adapter over `useMedicine`, behaviour unchanged).

- [ ] **Step 1: Write the failing test** `toStoreData matches the old reducers`. Run the demo explore result through the old `dashboardReducer` `EXPLORE_STORE` and `items-by-shop` `EXPLORE_STORE_ITEMS`, then expect the same fields from `toStoreData`.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement**, then switch readers file by file. The layout uses `useGroceryStore()`: Loader while `isLoading`, then `StoreUnavailable` when `status`, otherwise `children`. It no longer dispatches `CLEAR_ALL` / `EXPLORE_STORE*`.
- [ ] **Step 4: Verify** that Grocery no longer writes to these slices: `grep -rnE "EXPLORE_STORE\b|EXPLORE_STORE_ITEMS|VISITED_STORE\b|visitedGroceryStore" apps/web/src | grep -v src/redux/` gives no output.
- [ ] **Step 5:** Full checks plus e2e. Also check by hand that Medicine pages look and work the same (store home, a type page, the cart drawer).
- [ ] **Step 6: Commit** — `refactor(web): grocery store pages read the explore query through useStoreData`

---

### Task 6: Shared store-module components (Grocery switched)

Medicine keeps its own copies until PR 3. Each shared component is driven by a config, so PR 3 only adds the `medicine` entry and deletes `components/Medicine/*` duplicates.

**Files:**
- Create (in `apps/web/src/components/StoreModule/`): `moduleItems.ts` (config), `StoreItemTile.tsx` (from `GroceryItems.jsx`), `StoreItemDetails.tsx` (from `GroceryItemDetails.jsx`), `ItemDetailsModal.tsx` (from `GroceryItemDetailsModal.jsx`), `FavoriteItemDetailsModal.tsx` (from `GroceryFavoriteItemsDetailsModal.jsx`), `SubTypeItems.tsx` (from `SubTypeSection.jsx`), `SearchedItems.tsx` (from `SearchedProducts.jsx`), `FavoriteStores.tsx` (from `FavoriteShop.jsx`), `StoreListSection.tsx` (from `GrocerySection.jsx`)
- Modify: `StoreModule/itemCards.js` (grocery → `StoreItemTile`), the grocery pages under `app/grocery/**` (→ `.tsx`, rendering the shared components with `moduleName="grocery"`), `StoreModule/FavoriteItems.jsx` (grocery uses `StoreItemTile`)
- Delete: `components/Grocery/{GroceryItems,SubTypeSection,SearchBarSection,FavoriteSection,GrocerySection,GroceryCategorySection,ProductsByCategory}/*` once they have no importers. `hooks/fetch-data/useGroceryProduct.js`.

**Interfaces:**
- Consumes: Task 4 hooks, Task 5 `useStoreData`.
- Produces: `ITEM_MODULES: Record<"grocery", ItemModuleConfig>` with
  `ItemModuleConfig = { merchantType: 0 | 1; basePath: string; imageBaseUrl: string; idField: "productInfoTable" | "medStoreProductInfo"; titleField: "product_title_eng" | "item_title_eng"; titleBengField: "product_title_beng" | "item_title_beng"; subtitle: (item) => string; useCart: () => GroceryCartApi; useItemList: (q) => ItemListResult; useItem: (id) => ItemResult; seedItem: (qc, storeId, item) => void }`.
  These fields cover every line of the Grocery↔Medicine diffs measured today (ids, titles, `strength || pack_size`, image base URL, merchant type, base path). The Medicine entry comes in PR 3.
  Each component takes `{ moduleName: "grocery" }` plus the props the Grocery original took (for example `item` and `isFavorite` for `StoreItemTile`).
  The item-detail URL replace/restore logic in `GroceryItems.jsx` moves unchanged. On restore, it no longer clears Redux; there is nothing to clear.

- [ ] **Step 1:** Move one component at a time. Keep the markup and class strings byte-for-byte except for the config lookups. Run `npm run e2e -w web -- grocery.spec.ts` after each move.
- [ ] **Step 2: Verify** with `grep -rnE "state\??\.(itemsByStore|dashboard|product)|currentItemDetails|SAVE_CURRENT_ITEM_DETAILS" apps/web/src/components/StoreModule apps/web/src/app/grocery apps/web/src/hooks/grocery`. The only hits allowed are the medicine branch of `useStoreData.ts`. Medicine's own `SAVE_CURRENT_ITEM_DETAILS` stays.
- [ ] **Step 3:** Full checks plus e2e. Compare a screenshot before and after the change for the store home, a type page and the product page, at 375px and 1280px in light and dark mode.
- [ ] **Step 4: Commit** — `refactor(web): shared store-module item components, grocery switched`

---

### Task 7: Checkout and orders (RHF, query, mutation)

**Files:**
- Create: `StoreModule/StoreCheckout.tsx` (from `Grocery/CheckoutSection.jsx`), `StoreModule/StoreOrders.tsx` and `StoreOrderDetails.tsx` (from `Grocery/OrdersSection/{OrdersSection,OrderDetailsMobile}.jsx`), `apps/web/src/lib/api/schemas/checkoutForm.ts`. `OrderUI.jsx` and `OrderDetailsModal.jsx` move to `StoreModule/orders/` as `.tsx` (Food also imports `OrderUI`, so update its import path only).
- Test: `apps/web/src/components/StoreModule/StoreCheckout.test.tsx`
- Delete: `components/Grocery/` (now empty), `hooks/place-order/useOrderGrocery.js`.

**Interfaces:**
- Consumes: `useZodForm`, `FormField` (PR 1); `usePlaceGroceryOrder`, `useGroceryOrders`, `useStoreRef`.
- Produces:
  - `checkoutFormSchema = z.object({ remarks: z.string().max(500, "Keep the note under 500 characters"), paymentOption: z.string().min(1) })`. The 500 limit matches `placeOrderInput.shortNote`; today the API quietly drops a longer note. This is a bug fix to call out in the PR body.
  - `StoreCheckout({ moduleName: "grocery" })` builds the same order object as today, including `merchant_id`/custom ids. It now takes the store ref from `useStoreRef()` instead of `state.itemsByStore`, plus the same `customerInfo`, `orderItems` and `paymet_method` fields.
  - The orders page no longer reads `state.user.groceryOrderInfo` or dispatches `SAVE_GROCERY_ORDER_INFO`. That Redux field stays registered (rollback) and is now unused.

- [ ] **Step 1: Write the failing test** `checkout blocks a 501-character note and submits a valid form`. Mock `usePlaceGroceryOrder` and expect `placeOrder` to be called once with `shortNote` equal to the note and `paymet_method` equal to the first `PAYMENT_DATA` label.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement**, then switch the checkout, orders and order-detail pages.
- [ ] **Step 4: Verify** that `grep -rn "groceryOrderInfo\|useOrderGrocery\|components/Grocery" apps/web/src | grep -v src/redux/` gives no output.
- [ ] **Step 5:** Full checks plus e2e.
- [ ] **Step 6: Commit** — `refactor(web): grocery checkout on RHF and orders on TanStack Query`

---

### Task 8: Cross-module e2e, final checks, PR notes

**Files:**
- Modify: `apps/web/e2e/grocery.spec.ts`, `apps/web/src/lib/api/queryKeys.ts` (remove unused keys), `docs/superpowers/plans/2026-11-22-web-modernization-pr1-foundation.md` (tick PR 2 in the roadmap)

- [ ] **Step 1: Add e2e tests**
  - `medicine then grocery uses the grocery store`. Open a Medicine store, then a Grocery store. Add a favourite item and search, and assert the request URLs carry the Grocery `storeId` (`page.waitForRequest`) (Review Focus 2).
  - `old saved module is kept`. Seed `persist:root.dashboard` with `currentModule: "Food"` and no `notension-preferences`. Open a Food store, and the cart drawer still works (Review Focus 5).
  - `reload on product page`. Open the product from a list, reload, and expect the same title (Review Focus 3).
- [ ] **Step 2: Full verification.** Run `npx turbo run lint typecheck test build`, `npx eslint apps/web/src --rule '{"no-undef":"error"}'` and `npm run e2e -w web`. Lint warnings must be at or below the baseline. `find apps/web/src/app/grocery apps/web/src/hooks/grocery -name "*.js*"` must give no output. In the browser (dev server), check demo mode with the API forced offline: grocery browse, search, cart, checkout and orders. Check Medicine and Food once.
- [ ] **Step 3: Commit** — `test(web): grocery cross-module e2e and PR 2 wrap-up`

PR body notes (for the owner): the bridge in `useStoreData` (Medicine still on Redux); `currentModule` now lives in `notension-preferences`; the hydration write-back change; the checkout note limit (bug fix); `currentItemDetails` is replaced by query seeding, so a reload on a product page refetches (one request; it used to read the persisted copy); `userChoice.currentGroceryStore`/`defaultGroceryStore` have no writers anywhere, so they are dead and left for PR 9 to delete.

Then stop and ask the owner before pushing or opening the PR.

---

## Builder's calls (owner can override)

- **The preferences store holds only `currentModule` in PR 2.** The spec lists "current/default store per module, current item details". In practice `currentGroceryStore`/`defaultGroceryStore` are never written, so they are always `{}`. The store being viewed comes from the URL. Item details are server data, so they are seeded into the query cache instead of persisted. PR 7 adds the all-care selections.
- `currentModule` moves for every module in one go (all writers and readers are small dispatch swaps), so it never has two sources.
- The shared components live in `components/StoreModule` as `.tsx`, and Medicine adopts them in PR 3.
