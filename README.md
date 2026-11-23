# NoTension

NoTension is a multi-service marketplace web app for Bangladesh. One site lets
a customer order groceries, medicine and food from nearby stores, shop for
fashion and lifestyle products, find doctors and medical centres, and book
local service providers. Content is filtered by the customer's district.

The app is a Next.js frontend and a new TypeScript API in one monorepo. The frontend gets its data from the API, and falls
back to built-in sample data (**demo mode**) whenever the API can't be
reached, so it still works without a backend.

## Modules

| Module | Route | What it does |
| --- | --- | --- |
| Home | `/` | Entry point with favourites and links to every module |
| Grocery | `/grocery` | Find nearby grocery stores, browse items, cart, checkout, orders |
| Medicine | `/medicine` | Same flow for pharmacies |
| Food | `/food` | Restaurants by category, menus, cart, checkout, orders |
| Fashion & Lifestyle | `/fashion-lifestyle` | Product catalogue with categories, filters, wishlist, checkout, orders |
| Medical services | `/medical-services` | Doctors by department, hospitals, diagnostic, dental and eye-care centres, appointments |
| All Care Services | `/all-care-services` | Local service providers (repairs, tutoring, events, construction and more) |
| User | `/login`, `/user/profile`, `/user/update-address` | Log in with a mobile number and OTP, profile and address |
| Marketing policy | `/marketing-policy` | Merchant fees and partner policy (Bangla) |

## Tech stack

- Monorepo: npm workspaces and [Turborepo](https://turborepo.com)
- [Next.js 16](https://nextjs.org) (App Router) and React 19
- TypeScript 7 (existing code is JavaScript and moves over gradually)
- Tailwind CSS 4
- Zod for shared, validated business rules (`packages/shared`)
- Vitest for unit tests, Playwright for smoke tests
- Redux Toolkit with `redux-persist` for cart, user and module state
- TanStack Query and Axios for data fetching
- Swiper for sliders, `react-icons`, `react-hot-toast`
- Google Maps JavaScript API for location

> Next.js 16 changes several APIs and conventions. Before changing framework
> code, read the matching guide in `node_modules/next/dist/docs/` (see
> [`AGENTS.md`](AGENTS.md)).

## Getting started

Requirements: Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/NizamChy/notension-main.git
cd notension-main
npm install
npm run dev
```

Open <http://localhost:3000>. Without the API running (`npm run dev -w api`)
the app switches to sample data for Dhaka and Chittagong on its own.

To sign in quickly, open the login form and choose **Log in as Demo User**
(needs the API). No OTP is needed. **Log in as Admin** below it opens
`/admin/login`. Demo sign-ins for every staff role are on `/demo-accounts`;
the footer links to both.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the web app's development server |
| `npm run build` | Build every package |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check every package |
| `npm run test` | Run the unit tests (Vitest) |
| `npm run e2e` | Run the smoke tests (Playwright, uses the installed Chrome) |

Run these from the repository root. Turborepo runs each task in every
workspace that has it and caches the results. GitHub Actions runs lint,
typecheck, tests, build and the smoke tests on every pull request.

## Configuration

The real backends are configured with environment variables. Copy the example
file and fill in the values:

```bash
cp apps/web/.env.example apps/web/.env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_USER_URL` | User service: login, OTP, profile, address |
| `NEXT_PUBLIC_GROCERY_URL` | Grocery service |
| `NEXT_PUBLIC_MEDICINE_URL` | Medicine service |
| `NEXT_PUBLIC_FOOD_URL` | Food service |
| `NEXT_PUBLIC_HEALTH_CARE_URL` | Doctors, hospitals and medical centres |
| `NEXT_PUBLIC_ALL_CARE_SERVICE_URL` | All Care service providers |
| `NEXT_PUBLIC_ALL_DISTRICTS_URL` | District list used for location |
| `NEXT_PUBLIC_FASHION_BASE_URL` | Fashion & Lifestyle service |
| `NEXT_PUBLIC_IMAGE_URL` | Base URL for store and item images |
| `NEXT_PUBLIC_FASHION_IMAGE_URL` | Base URL for fashion images |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps key with Maps JavaScript API, Geocoding API and Places API enabled |
| `NEXT_PUBLIC_SMS_KEY` | SMS gateway key for sending OTPs |

Never commit `.env.local` or real keys.

> **Security note:** every `NEXT_PUBLIC_` variable is bundled into the
> browser code and visible to anyone. Restrict the Google Maps key to your
> domains in Google Cloud. The SMS key should move to a server-side route
> (without the `NEXT_PUBLIC_` prefix) so it is not exposed.

The location picker (`src/components/shared/Map/LocationPicker.jsx`) is
built to stay inside Google Maps' free monthly usage: the Maps script loads
only when the picker opens, one map is created per opening, and the address
under the pin is looked up only after the map stops moving, with results
cached per ~10 m.

## Backend

The new API lives in [`apps/api`](apps/api/README.md). It answers the same
requests as the old backends, module by module, and runs locally with no
database setup (embedded Postgres). Every module runs on it (list in
`apps/web/src/api-endpoints/live.ts`), called through the web app's
`/api-proxy/<service>` rewrite, which points at `http://localhost:4000` in
development and `https://notension-api.vercel.app` in production.

## Demo mode

Demo mode turns itself on when the API is down, and can be chosen by hand:

- Every request goes to the API first. When the API can't be reached (the
  health check on page load fails, or a request gets no answer or a server
  error), `src/demo/demoAdapter.ts` answers from the routes in
  `src/demo/modules/` instead. Orders and other writes fall back only when
  they surely never reached the API, so nothing is placed twice.
- A banner says the site is showing sample data. The API is checked again
  every minute; once it answers, the banner offers a reload.
- Sign-in and favourites wait for the API (they need the real account). The
  admin panel never shows sample data.
- Orders and bookings made on sample data live in memory and are lost on
  reload.
- Images are always served from `public/demo/` through a rewrite in
  `next.config.mjs`. Data exists for Dhaka (default) and Chittagong.

- The **Live / Demo mode** button on the home page shows whether the server
  is connected, and its switch shows sample data even while the API works
  (saved per browser; switching clears the cart and sign-in and reloads).
  With it on, **Log in as Demo User** uses the demo sign-in.

State: `apps/web/src/demo/backendStatus.ts`. Banner:
`apps/web/src/components/shared/BackendStatus/BackendStatusBanner.jsx`.

To add or change demo data, see
[`apps/web/src/demo/README.md`](apps/web/src/demo/README.md). The API's seed
loads the same data into the database.

## Dark mode

The sun/moon button in every navbar switches between light and dark. The
choice is saved per browser. The site starts in light mode, even when the
system is set to dark, until the visitor switches.

How it works:

- The theme is the `dark` class on `<html>`. An inline script in
  `src/app/layout.tsx` sets it before the first paint, so the page doesn't
  flash light. The button is `src/components/shared/ThemeToggle`.
- The `gray` and `slate` scales and `deepGray` / `mediumGray` / `lightGray`
  read CSS variables (the `@theme` block in `src/app/globals.css`), so they
  flip in dark mode without `dark:` classes.
- `bg-white`, light tinted backgrounds (`bg-[#FFF1EA]` and so on) and dark
  brand text (`text-primary`, `text-secondary`) get dark values in the `@layer utilities` block of
  `globals.css`. When you add a new light background or dark text color that
  isn't on the gray scale, add its dark value there or use a `dark:` class.

## Roadmap

Known gaps and planned work, most important first.

### Still to fix

- **Security:** restrict the Google Maps key to the site's domains and move
  the SMS gateway call to a server route so its key never reaches the browser.
- **Fashion product photos:** some products show a photo that doesn't match
  the item (the demo reuses a shared photo pool).
- **Medicine photos:** a few products share the same generic photo.
- **Grocery checkout:** the delivery charge shows ৳0.00.
- **Theme toggle:** two quick clicks don't switch back (the handler reads React
  state instead of the `dark` class on `<html>`).
- **Footer:** social icons stay hidden until real URLs are added to
  `SOCIAL_LINKS`. The fashion module still has its own older footer.
- **Fashion:** one shop name needs correcting in the demo data.
- **Doctor data:** a doctor with two chambers is listed twice in a department.
- **Dark mode:** modals, dropdowns and checkout have not been fully reviewed.
  Some white-on-teal and white-on-yellow buttons have low contrast.
- **Location state:** latitude, longitude and district are stored twice in
  the user slice (top level and in `currentUserLocation`), and `useUser.ts`
  sends latitude and longitude swapped (demo mode compensates).

### Known limitations

- Demo orders, bookings and favourites are lost on reload.
- OTP sign-up can't be tested in demo mode.
- Direct links to an all-care service search only the first page of results.

### Features not built yet

- Doctor video consultation
- Online payment gateway integration for bKash and Nagad
- Home sample collection for lab tests
- Health check-up packages
- Search doctors by code, plus specialty descriptions and a stats row on the
  doctor pages

## Project structure

```
apps/
  web/                 Next.js frontend
    public/demo/       Demo images, one folder per module
    src/
      app/             Routes (App Router), one folder per module
      components/      UI components, grouped by module
      api-endpoints/   Backend base URLs (env.ts) and endpoint paths
      demo/            Demo mode: adapter, sample data, locations, demo user
      hooks/           Data-fetching and order hooks
      lib/apiClient.ts Axios client per backend (routes through demo mode)
      redux/           Store, slices and persistence
      utils/           Helpers (dates, validation, Google Maps loader)
    e2e/               Playwright smoke tests
  api/                 Backend: Hono, Zod, Drizzle, Postgres + PostGIS
                       (see apps/api/README.md)
packages/
  shared/              Code shared by frontend and backend: pricing rules
                       (Zod), slugs, and the API contract
                       (contract/) both apps build against.
turbo.json             Task pipeline
```

## Deployment

The app is deployed on [Vercel](https://vercel.com). Every pull request gets a
preview deployment, and merging to `main` deploys to production. The Vercel project's Root
Directory is `apps/web`. Set the environment variables above in the Vercel
project settings.

## Contributing

1. Create a branch from `main` (for example `fix/cart-total`).
2. Make your change and run `npm run lint`, `npm run typecheck`,
   `npm run test` and `npm run build`.
3. Open a pull request to `main` and check the Vercel preview.
