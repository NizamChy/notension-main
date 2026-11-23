# Web Modernization — PR 8 (Account / shared) Implementation Plan

**Goal:**
- Favourites leave Redux: the grocery/medicine/food stores, the grocery/medicine items, and the consultation centres and doctors in `userChoice`.
- `components/common/` merges into `components/shared/`.

After this PR no component reads or writes Redux. What is left is the rollback dispatches in the order hooks, `useUser` and `logout`, plus the store itself; PR 9 removes them.

**Scope check (account / user fields):** what PR 8 meant by `user` server fields was already done. The session and location moved in PR 1; orders, patients and appointments moved in PRs 2–6. The Account, Login, Admin and LandingPage components read no Redux. So favourites are the account data that is left.

**Architecture:**
- `lib/api/favourites.ts` has `saveFavourite(kind, body)` (push) and `removeFavourite(kind, body)`, typed on the shared `favourites` contract.
- `stores/favouritesStore.ts` is a Zustand persist store under `notension-favourites`. It keeps one list per `kind:merchantType`:
  - `store:0/1/2` (grocery, medicine, food stores)
  - `item:0/1` (grocery, medicine items)
  - `list:3/4` (centres, doctors)

  It is seeded once from `persist:root.userChoice`, cleared on logout (where `CLEAR_FAVOURITES` cleared it) and on the sample/live switch.
- `hooks/favourites/useFavourites.ts` (kind) saves and removes, keeps the per-list limits and messages, and updates the store from the API answer.
- `useFavouriteStore`, `useFavouriteItem` and `useFavouriteList` keep their shapes as `.ts` wrappers, so their callers do not change. The list pages read `useFavouriteEntries(kind, merchantType)`.

**Builder's calls:**
- **Always push, never add.** The API's "add" endpoints replace the whole server list, and the app called them whenever the device's list was empty, for example after a logout. That wiped favourites saved on another device. Push saves one entry and dedupes by id.
- **Remove by id on the device.** The removal is applied by id, not by taking the server's remaining list, because the demo backend forgets favourites on reload.
- **Unused members dropped.** `useFavouriteItem`'s product-details fetchers, `resetReducer` and `setCurrentModule` had no callers.
- **`common/` moves into `shared/`:** `Loader`, `ErrorPage`, `NoItemFound` and `Slider` each get a folder, and `CheckoutCard` moves to `Checkout/`. The two different round loaders stay as they are, so the UI does not change: `common/RoundLoader` (the bars spinner) becomes `shared/RoundLoader/BarsLoader.jsx`.

## Global Constraints
Same as PRs 2–7: no visible change, demo mode keeps working, contracts are not loosened, and the same checks are run.

## Tasks
1. **Favourites API, store and hook.** Tests:
   - push only
   - limits
   - guest no-op
   - items and the list
   - legacy seed
   - sample-switch clear
2. **Switch the favourite hooks and list pages.** Move `common/` to `shared/`.
3. **e2e + wrap-up.** Add `e2e/favourites.spec.ts` covering:
   - a store favourite added, kept after a reload, and removed
   - a doctor favourite
   - logout clears favourites

   Then run the full checks and tick PR 8.

PR body note: the `userChoice` slice has no readers or writers left except the rollback `CLEAR_FAVOURITES` in `useUser` (removed in PR 9).
