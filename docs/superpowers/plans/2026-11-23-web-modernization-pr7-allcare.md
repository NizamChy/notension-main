# Web Modernization — PR 7 (All Care) Implementation Plan

**Goal:** All Care reads its services and providers through a typed API (checked against the shared `allCare` contract) and TanStack Query instead of the `allCare` Redux slice. `useAllCareService` is deleted.

**Architecture:**
- `lib/api/allCare.ts` has `exploreServices(districtId)` and `exploreProviders(serviceId, location)`, with today's params, and `queryKeys.allCare`.
- `hooks/allCare/useAllCare.ts` holds:
  - `useCareServices`: the district's services and sliders. The query key includes the district, so data saved for another district never shows (what `servicesDistrictId` guarded).
  - `useCareService(serviceId)`: the service looked up in that list.
  - `useCareProviders(serviceId)`: popular and nearest providers.
  - `useCareProvider(serviceId, providerId)`: the provider looked up in the providers query. A card click already has it cached, and a direct link fetches it.

**What the click-saved Redux fields become:** both come from the URL. `currentService` is the URL `serviceId`; `currentProviderDetails` is the URL `id` (cards already put it there).

**Roadmap note:** the roadmap planned moving "selection fields" into the preferences store. Once both come from the URL there is nothing left to persist, so no store field is added.

**Builder's calls:**
- The All Care home still sets the current module to "dashboard", as `exploreAllCareService` did.
- A provider-details link without `id` (only links from before the id was added) now shows "not found" instead of the provider last saved in Redux.

## Global Constraints
Same as PRs 2–6: no visible change, demo mode keeps working with the API unreachable, contracts are not loosened, and the same checks are run.

## Tasks
1. **Typed API, keys and hooks.** Tests:
   - every demo answer matches the contract
   - today's params
   - the service and provider lookups, including an unknown id
2. **Switch All Care.** Switch `AllCareHome`, `ServicesArea`, `ExploreService`, `ServiceCard`, `NearestInfoCard` and `ServiceProviderDetails`. Delete `useAllCareService`.
3. **e2e + wrap-up.** Add `e2e/allcare.spec.ts` covering:
   - home → service → provider
   - a direct service link
   - a direct provider link and its reload
   - an unknown provider

   Then run the full checks and tick PR 7.

PR body note: the `allCare` slice has no writers left (kept for rollback, removed in PR 9).
