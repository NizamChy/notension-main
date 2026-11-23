# Web Modernization — PR 6 (Health Care) Implementation Plan

**Goal:** Doctors, centres, patients and appointments read through a typed API (checked against the shared `healthCare` contract) and TanStack Query instead of the `doctorInfo` Redux slice and the `user.patientInfo` / `user.bookedAppoinmentInfo` fields.
- `useDoctor`, `useCenter`, `usePatient` and `useAppointment` are deleted.
- The `BookedAppointment` UTC date bug is fixed: `new Date("YYYY-MM-DD")` is UTC midnight, so west of UTC the card showed the day before.

**Architecture:**
- `lib/api/healthCare.ts` holds:
  - reads: `exploreFindDoctor`, `getNearestDoctors`, `getDoctorsByDept`, `getDoctorsByCenter`, `getDoctorProfile`, `getNearestCenters`, `getCentersByDistrict`, `searchCenters`, `exploreCenter`
  - writes: `getPatients`, `registerPatient`, `managePatient`, `bookAppointment`

  They take today's params. `queryKeys.healthCare` holds the query keys.
- `hooks/healthCare/` holds:
  - `useFindDoctor`: departments, popular doctors and the three banner sets for the district.
  - `useNearestDoctors`, `useNearestCenters(type)` and `useCenterSearch(type, text)`.
  - `useDoctorsByDept(deptId)`, `useDoctorsByCenter(centerId, deptId)` and `useCentersByDistrict(type)`. These are infinite queries with pages of 20; a short page ends the list, as before.
  - `useDoctorProfile(doctorId)` and `useConsultationCenter(centerId)` (explore).
  - `usePatients` and `useBookAppointment`.
- **What the click-saved Redux records become:**
  - The centre comes from `useConsultationCenter(params.id)`.
  - The department is looked up in `useFindDoctor` by the URL id, falling back to the doctors' chambers.
  - The doctor for booking: the profile pages send the booking page to `/medical-services/doctor/book-appointment?doctor=<id>&center=<id|null>`. The booking page reads the chamber from `useDoctorProfile` with the same rule as the profile page, so a reload or direct link works.
- **Patients and booked appointments** are only kept on the device: the API has no appointments list, and the demo backend forgets patients on reload. They move to `stores/healthStore.ts`, a Zustand persist store under `notension-health`.
  - It is seeded once from `persist:root.user.patientInfo` / `bookedAppoinmentInfo`.
  - It is cleared by `logout()` (where `LOGOUT_USER` cleared them) and by the sample/live switch.
  - The server's patient list replaces the local one when it is non-empty, as today.

**Builder's calls:**
- The booking URL gains `?doctor=&center=` instead of relying on a saved Redux record. Without them the page asks the visitor to choose a doctor.
- The Health Care UI components stay `.jsx` and only swap Redux and the old hooks for the new hooks (as Food did).
- `useServiceProvider` (All Care, PR 7) stays as it is except for its banner fallback, which now comes from `useFindDoctor`.

## Global Constraints
Same as PRs 2–5:
- No visible change except the booking URL and the date fix.
- Demo mode keeps working with the API unreachable.
- Contracts are not loosened.
- Favourites stay as they are (PR 8).
- The same checks are run.

## Tasks
1. **Typed health care API and keys.** Tests: every demo answer matches the contract, nearest/paging params, and an unknown centre gives `centerInfo: null`.
2. **Hooks and health store.** Tests:
   - paging ends on a short page
   - the centre explore
   - the store: legacy seed, add/update/delete patient, add/prune appointments, logout and sample-switch clearing
   - the booking guard against repeat clicks
3. **Switch Health Care.** Switch every `doctorInfo` reader and writer, the patient/appointment components and the booking flow. Fix the date bug in `BookedAppointment` with a local-date parse (`parseLocalYMD`). Delete the four old hooks.
4. **e2e + wrap-up.** Add `e2e/healthcare.spec.ts` covering:
   - doctor home → department → doctor profile
   - a direct profile link
   - centre page and a direct link
   - an unknown centre
   - a centre-type listing (hospital)
   - search
   - book: login, register patient, book, then My appointments, kept after a reload
   - a direct booking link

   Then run the full checks and tick PR 6.

PR body notes: the `doctorInfo` slice, `user.patientInfo` and `user.bookedAppoinmentInfo` have no writers left (kept for rollback, removed in PR 9).
