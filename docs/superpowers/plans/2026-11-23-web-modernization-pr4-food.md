# Web Modernization — PR 4 (Food) Implementation Plan

**Goal:** Food reads its server data through a typed API and TanStack Query instead of Redux. It stops reading or writing `dashboard` (`shopCategory`, `DashboardSlider`, `visitedFoodStore`), `itemsByStore` (`productCategory`, `productInfoByShop`, `popularItem`, ids), `userChoice.currentItemDetails` and `user.foodOrderInfo`. Checkout uses the shared RHF `StoreCheckout`, and orders use `StoreOrders`/`StoreOrderDetails`. `useFood`, `useFoodCategory`, `useFoodItems`, `useOrderFood` and the Food checkout/orders components are deleted.

**Architecture:** `lib/api/food.ts` follows the pattern of `grocery.ts`/`medicine.ts` (the food explore uses `shopDetails`, lowercase, so it gets its own unavailable-store schema). `hooks/food/` holds:
- `useFoodModule` (categories + slider; replaces `shopCategory`/`DashboardSlider` and `useFoodCategory`)
- `useNearestFoodStores(category)` and `useFoodSearchStores(text, category)`
- `useFoodStore` (the restaurant in the URL: its shop, menu categories, dishes by category, popular dishes, status)
- `useFoodItem(id)`. The food API has no item endpoint, so it looks the dish up in the store query, as the old direct-link fetch did.
- `useFoodCart`, `useFoodOrders` and `usePlaceFoodOrder`

The restaurant always comes from the URL.

**Builder's call:** Food's UI components (restaurant header, menu, dish cards, category nav) are their own design, not StoreModule components. In this PR they stay `.jsx` and only swap Redux reads for the hooks. The data layer, the hooks and the `app/food` pages are TS. Converting the Food UI components to `.tsx` is left to a follow-up so that this PR is a data-layer change with no visual risk.

## Global Constraints
Same as PR 2/3: no visible change, demo mode keeps working with the API unreachable, contracts are not loosened, favourites stay in Redux (PR 8), and the same checks are run.

## Tasks
1. **Typed food API and keys.** Add `lib/api/food.ts` (`exploreModule`, `getNearestStores`, `searchStores`, `exploreStore`, `placeOrder`, `getOrders`) with today's params, and add `queryKeys.food`. Tests: all demo answers match the contract, closed/missing store status.
2. **Food hooks.** Add the hooks above, with tests for the module/category, the store and closed store, the dish lookup and not-found, the cart store-switch and the in-flight order click.
3. **Switch Food.** Switch the layout, category pages, store lists, header, menu, dish cards and details, cart (`cartModules`), `ShopInfo`, and checkout/orders (StoreModule configs get a `food` entry). The `app/food` pages become `.tsx`. Delete the old hooks and the Food checkout/orders components.
4. **e2e + wrap-up.** Add `e2e/food.spec.ts` covering the category list, nearby restaurants, restaurant menu, category page, dish direct link and not found, checkout and order, orders list, closed restaurant, Grocery then Food, and reload on a dish page. Run the full checks and tick PR 4.

PR body notes: the builder's call above; a dish page reload refetches the store menu (as a direct link already did); `visitedFoodStore`, `shopCategory`, the food `itemsByStore` cases, `foodOrderInfo` and `currentItemDetails` have no writers left (kept for rollback, removed in PR 9).
