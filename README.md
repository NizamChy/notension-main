# NoTension

NoTension is a multi-service marketplace web app for Bangladesh. One site lets
a customer order groceries, medicine and food from nearby stores, shop for
fashion and lifestyle products, find doctors and medical centres, and book
local service providers. Content is filtered by the customer's district.

The app is a Next.js frontend. It talks to several separate backend services
over HTTP and ships with a **demo mode** that answers every request from
built-in sample data, so it runs without any backend.

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

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- Tailwind CSS 3
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

Open <http://localhost:3000>. Demo mode is on by default, so the app works
right away with sample data for Dhaka and Chittagong.

To sign in during a demo, open the login form and choose **Log in as Demo
User**. No OTP is needed.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Configuration

The real backends are configured with environment variables. Copy the example
file and fill in the values:

```bash
cp .env.example .env.local
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
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `NEXT_PUBLIC_SMS_KEY` | SMS gateway key for sending OTPs |

Never commit `.env.local` or real keys.

> **Security note:** every `NEXT_PUBLIC_` variable is bundled into the
> browser code and visible to anyone. Restrict the Google Maps key to your
> domains in Google Cloud. The SMS key should move to a server-side route
> (without the `NEXT_PUBLIC_` prefix) so it is not exposed.

## Demo mode

Demo mode lets the app run without the backends:

- Every API request is answered by `src/demo/demoAdapter.js` from the routes
  in `src/demo/modules/`. No request reaches a real backend.
- Images are served from `public/demo/` through a rewrite in
  `next.config.mjs`.
- Sample data exists for Dhaka (default) and Chittagong.
- Orders, bookings and favourites made in demo mode live in memory and are
  lost on reload.

Use the **Demo mode** button on the home page to switch it off or on. The
choice is saved per browser. With demo mode off, the app uses the backend URLs
from your environment variables.

To add or change demo data, see [`src/demo/README.md`](src/demo/README.md).

## Dark mode

The sun/moon button in every navbar switches between light and dark. The
choice is saved per browser; until a choice is made the site follows the
system setting.

How it works:

- The theme is the `dark` class on `<html>`. An inline script in
  `src/app/layout.js` sets it before the first paint, so the page doesn't
  flash light. The button is `src/components/shared/ThemeToggle`.
- The `gray` and `slate` scales and `deepGray` / `mediumGray` / `lightGray`
  read CSS variables (`tailwind.config.mjs`, `src/app/globals.css`), so they
  flip in dark mode without `dark:` classes.
- `bg-white`, light tinted backgrounds (`bg-[#FFF1EA]` and so on) and dark
  brand text (`text-primary`, `text-secondary`) get dark values at the end of
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
- **Cleanup:** 21 unused images in `public/images/home/`, the unused
  dotlottie package and the `OrderUI` folder.

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
public/
  demo/              Demo images, one folder per module
  images/, png/, svg/ Static assets
src/
  app/               Routes (App Router), one folder per module
  components/        UI components, grouped by module
    common/          Shared building blocks (sliders, checkout card, ...)
    shared/          Site-wide navbar, footer, modals
    StoreModule/     Shared store layout for grocery and medicine
  api-endpoints/     Backend base URLs (env.js) and endpoint paths
  demo/              Demo mode: adapter, sample data, locations, demo user
  hooks/             Data-fetching and order hooks
  lib/apiClient.js   Axios client per backend (routes through demo mode)
  redux/             Store, slices and persistence
  utils/             Helpers (prices, dates, validation, Google Maps loader)
```

## Deployment

The app is deployed on [Vercel](https://vercel.com). Every pull request gets a
preview deployment, and merging to `main` deploys to production. Set the
environment variables above in the Vercel project settings.

## Contributing

1. Create a branch from `main` (for example `fix/cart-total`).
2. Make your change and run `npm run lint` and `npm run build`.
3. Open a pull request to `main` and check the Vercel preview.
