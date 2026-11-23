# Web Modernization — PR 3 (Medicine) Implementation Plan

**Goal:** Medicine moves onto what PR 2 built for Grocery: a typed API on the shared `medicine` contract, TanStack Query hooks, the config-driven `components/StoreModule` components, and the RHF checkout. Medicine stops reading or writing the Redux `dashboard` (`visitedMedicineStore`, `typeInfo`, …), `itemsByStore` and `userChoice.currentItemDetails` data. `components/Medicine/` and the old medicine hooks are deleted (the Grocery↔Medicine duplication cleanup).

**Architecture:** Same as PR 2. `lib/api/medicine.ts` wraps the endpoints. `hooks/medicine/` holds the query hooks, and the store always comes from the URL (`useStoreRef`). `useStoreData("medicine")` uses the explore query through the existing `toStoreData` (the medicine and grocery explore reducer cases are identical), so the Redux branch goes away. Each StoreModule config (`ITEM_MODULES`, `STORE_LISTS`, `FAVORITE_STORES`, checkout and orders) gains a `medicine` entry. Medicine-only differences are config fields, not branches.

**Spec:** `docs/superpowers/specs/2026-11-22-web-modernization-design.md`. Roadmap row 3 in `2026-11-22-web-modernization-pr1-foundation.md`.

## Global Constraints

- Branch `feat/web-modernization-medicine` from `main`, one commit per task.
- No visual or behaviour change for users. Every difference is listed in the PR body.
- Demo mode keeps working with the API unreachable. Demo answers are only `safeParse`d.
- Shared contracts are not loosened. Web-only schemas go in `lib/api/schemas/`.
- Food and Fashion behave exactly as before. Favourites stay in Redux until PR 8.
- New and converted Medicine files are `.ts/.tsx`.
- Checks: `npx turbo run lint typecheck test build`, `npm run e2e -w web`, and the `no-undef` lint.

## Medicine differences the configs must carry (measured by diffing the Grocery originals at `f809f8a^` against `components/Medicine`)

| Where | Grocery | Medicine |
|---|---|---|
| ids / titles | `productInfoTable`, `product_title_*` | `medStoreProductInfo`, `item_title_*` |
| merchant type | 0 | 1 |
| tile subtitle | `pack_size` | `strength \|\| pack_size` |
| details | `pack_size` chip; Pack size, Unit rows | + `generic_name` highlight, `company_name` byline, `strength` chip, "Prescription required" amber badge; Generic name, Manufacturer, Strength, Pack size, Unit rows; Bangla title falls back to `product_title_beng` |
| savings | MRP − sale | same, rounded to 2 decimals |
| list wording | "products", "No products found", "Check the spelling or try a more general word.", "This category has no products in stock right now." | "medicines", "No medicines found", "Check the spelling, or search by brand or generic name.", "This category has no medicines in stock right now." |
| favourite quick view removal | removes the saved entry | removes by the loaded item's fields |
| store list | "Grocery stores near you" … | "Pharmacies near you", "Pick a pharmacy to start ordering", "No pharmacies nearby", "We don't have a pharmacy delivering to this area yet. Try changing your delivery location." |
| item API params | `groceryStoreId` | `merchantId` (item details: `medStoreProductInfo`) |

## Tasks

1. **Typed medicine API and keys.** Add `lib/api/medicine.ts` with `getNearestStores`, `searchStores`, `exploreStore`, `getItemPage`, `getItem`, `placeOrder` and `getOrders`, using today's params. Add `queryKeys.medicine`. Tests: every demo answer matches the contract, params per list kind, and an unknown id gives `null`.
2. **Medicine query hooks.** Add `hooks/medicine/`: `useMedicineStore`, `useNearestMedicineStores`, `useMedicineSearchStores`, `useMedicineItemList`, `useMedicineItem` + `seedMedicineItem`, `useMedicineCart`, `useMedicineOrders` and `usePlaceMedicineOrder`. They mirror the grocery hooks. Tests for the store, closed store, paging, seeded item, cart store-switch and in-flight order click.
3. **Store data, layout, cart and shop info.** Point the `useStoreData` medicine branch at the query and delete the Redux branch. Switch `cartModules`, `storeModules` (`useStores`), `ShopInfo` and `app/medicine/[store]/layout` → `.tsx`. Delete `useMedicine.js` and `useMedicineItems.js`.
4. **Shared item components.** Add `medicine` entries with the config fields from the table above, and switch the Medicine pages to `.tsx` rendering the StoreModule components. Delete the `components/Medicine` item, list and favourite components.
5. **Checkout and orders.** `StoreCheckout`, `StoreOrders` and `StoreOrderDetails` get the medicine entry. Delete `useOrderMedicine.js` and `components/Medicine`.
6. **e2e + wrap-up.** Add `e2e/medicine.spec.ts` covering store home, type → sub-type, search (found / not found), product direct link and not found, checkout and order, orders list, closed store, Grocery then Medicine (store id from the URL), and reload on a product page. Run the full checks. Tick PR 3 in the roadmap.

PR body notes: the list of differences kept by config; the favourite quick view and the details page now share code (Bangla title fallback in the quick view too); the SubType page shows the offline screen when offline (as Grocery already did); `visitedMedicineStore`, `EXPLORE_MED_STORE` and `medicineOrderInfo` have no Medicine writers left and are left for PR 9.
