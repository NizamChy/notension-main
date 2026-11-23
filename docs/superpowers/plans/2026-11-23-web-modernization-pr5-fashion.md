# Web Modernization — PR 5 (Fashion) Implementation Plan

**Goal:** Fashion's server reads go through a typed API that is checked against the shared `fashion` contract, instead of untyped `axios` calls. The wishlist moves out of Redux (`userChoice.favouriteFashionItems`) into a persisted Zustand store. Product pages stop reading `product.currentProductDetails`.

**Architecture:**
- `lib/api/fashion.ts` follows the pattern of `grocery.ts`/`food.ts`. It exposes:
  - catalogue: types, categories, sub-categories, brands
  - products: the legacy men/women/kids lists and the filter (`PUT product-info-by-type/:typeId`)
  - stores: store info and the store taxonomy
  - orders: create order, orders by customer
- `request.ts` gets `apiPut`.
- `queryKeys.fashion` replaces the ad-hoc keys.
- The three fetch hooks (`useCategoryItem`, `useStoreItems`, `useProductOrder`) become `.ts` in place. They keep their public shape, so the 27 call sites don't change.
- Checkout posts through `placeOrder`.

**Wishlist:** `stores/wishlistStore.ts` is a Zustand persist store under `notension-wishlist`.
- On the first load it seeds from `persist:root.userChoice.favouriteFashionItems` (`legacyAwareStorage`) and is hydrated with the other stores.
- It is cleared on logout (where `CLEAR_FAVOURITES` cleared it) and on the sample/live switch (where the Redux purge cleared it).
- Its actions are `toggle`, `remove`, `has` and `clear`.

**Product details:** a card click seeds `queryKeys.fashion.product(id)` instead of dispatching `SAVE_CURRENT_PRODUCT_DETAILS`. The details page reads only `useProductById`, so a direct link or reload still fetches the product.

## Global Constraints
Same as PRs 2–4:
- no visible change
- demo mode keeps working with the API unreachable
- contracts are not loosened (fix demo data instead)
- Grocery/Food/Medicine favourites stay in Redux until PR 8
- the same checks are run

## Tasks
1. **Typed fashion API and keys.** Tests: every demo answer matches the contract, the filter sends today's body, and a missing store gives `null`.
2. **Wishlist store.** Tests cover toggle/remove, the legacy seed, logout and sample-switch clearing. Then switch the card, details page, navbar badge and wishlist page to it.
3. **Product details from the query cache.** Remove `SAVE_CURRENT_PRODUCT_DETAILS` from the card and `currentProductDetails` from the details page.
4. **e2e + wrap-up.** Add `e2e/fashion.spec.ts` covering:
   - home → product → details
   - a direct product link and its reload
   - wishlist add/remove, kept after a reload and badge count
   - store page
   - checkout → orders

   Then run the full checks and tick PR 5.

PR body notes: `favouriteFashionItems` and `currentProductDetails` have no writers left (kept for rollback, removed in PR 9).
