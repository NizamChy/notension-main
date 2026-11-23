import { z } from "zod";

// Web-only: demo orders do not carry the full shared `order` shape.
export const placeOrderResponse = z
  .object({ success: z.boolean(), message: z.string().optional() })
  .passthrough();
