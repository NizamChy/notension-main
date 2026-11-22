import { z } from "zod";
import { grocery } from "@notension/shared";

// Web-only: what explore-store answers for a store that is missing, closed,
// inactive or banned. Its shop record can be absent or partial, so it cannot
// meet the shared `groceryExplore` shape. The shared contract stays strict.
export const unavailableExplore = z
  .object({
    success: z.boolean(),
    result: z
      .object({ ShopDetails: z.array(z.object({}).passthrough()) })
      .passthrough(),
  })
  .passthrough()
  .refine(({ result }) => {
    const shop = result.ShopDetails[0] as
      | { is_closed?: boolean; is_active?: boolean; is_banned?: boolean }
      | undefined;
    return !shop || shop.is_closed === true || shop.is_active === false || shop.is_banned === true;
  }, "not a missing or unavailable store");

export type UnavailableExplore = z.infer<typeof unavailableExplore>;

export const exploreResponse = z.union([grocery.ok(grocery.groceryExplore), unavailableExplore]);
