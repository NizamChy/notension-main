# Demo mode

Demo mode is on by default. The "Demo mode" button on the home page turns it
off or on and switches between the locations that have demo data. While it is
on:

- every API request is answered by `demoAdapter.js` from the routes in
  `modules/*.js`. No request reaches a real backend.
- image base URLs (`IMAGE_URL`, `FASHION_IMAGE_URL` in
  `src/api-endpoints/env.js`) point at `/demo-images/...`, which
  `next.config.mjs` rewrites to `public/demo/`.
- the default location is `DEFAULT_DEMO_LOCATION` (Dhaka).

## Adding demo data for a backend

Each file in `modules/` exports `routes` for one backend:

```js
export const routes = [
  {
    service: "GROCERY", // FOOD | USER | GROCERY | MEDICINE | HEALTH_CARE | ALL_CARE | ALL_DISTRICTS | FASHION
    method: "GET",
    path: "/client-app-api/v1/grocery/find-store", // `:name` segments become params
    handler: ({ params, query, body, path, method }) => responseBody,
  },
];
```

- `service` is the base URL the request was sent to (see `SERVICE_BASES` in
  `demoAdapter.js`). `path` is the endpoint constant from
  `src/api-endpoints/api-endpoint.js`. Import the constant, do not retype it.
- `query` merges the URL query string and axios `params`; `body` is the parsed
  request body.
- Return the response body exactly as the components read it
  (`res.data...`). For an error status, `return demoResponse(400, body)`.
- Data only exists for the districts in `demoLocations.js`. Filter by the
  district ID the request sends; any other district gets the empty result the
  real backend would give.
- Writes (orders, bookings, favourites) live in memory for the page session.

## Images

The rewrite drops the first path segment after `/demo-images`:

- `${IMAGE_URL}/grocery-items-images/grocery/rice.webp` → `public/demo/grocery/rice.webp`
- `${FASHION_IMAGE_URL}/fashion/shirt.webp` → `public/demo/fashion/shirt.webp`

So an image field in demo data holds the path under `public/demo/`. Keep each
module's images in its own folder (`public/demo/<module>/`).

Demo images are freely licensed photos (CC0, public domain, CC BY, CC BY-SA)
from Wikimedia Commons, saved as small `.webp` files (quality ~64, at most
1400px wide). Every photo is credited in `public/demo/CREDITS.md`; add a line
there when you add one. Don't use photos of identifiable people or real brands
as stand-ins for fictional shops, doctors or products. The old `.svg`
placeholders stay next to the photos so carts saved in localStorage before the
switch still show an image. All-care provider logos are still SVG.

Where the UI shows an image with no text next to it, the image has to carry
its own label:

- Doctor department tiles (`health-care/dept-*.svg`) and the doctor nav tiles
  (`health-care/nav-*.svg`) are illustrations with the name drawn in, not
  photos.
- Slider and promo banners (grocery `slider-*`, medicine `banner-*`, food
  `slider-*`, health-care `banner-*`, all-care `banners/*`) are photos with the
  headline and subline drawn on a dark gradient on the left. Keep text in the
  vertical middle: the sliders crop the top and bottom (5:2, 2:1 or 3:1).
