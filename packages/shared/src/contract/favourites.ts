// A customer's favourites (stores, items, and the "list" of centres and
// doctors). Paths: /api/v1/customer/*. The owner is always the signed-in
// user; `customerInfo` / `custom_customer_id` in a request body are ignored.
import { z } from "zod";

export const KINDS = {
  store: { idField: "storeId" },
  item: { idField: "productId" },
  list: { idField: "mongodbId" },
} as const;
export type Kind = keyof typeof KINDS;

// Upper bound per kind and merchantType; the apps stop well before it.
export const MAX_PER_LIST = 100;
// The snapshot the app sends along (name, address, image, ...), as JSON.
export const MAX_ENTRY_BYTES = 4096;

const merchantType = z.coerce.number().int().min(0).max(99);

// add / push / remove: the id field of the kind plus merchantType; any other
// fields are the snapshot kept with the entry.
export const entryInput = (kind: Kind) =>
  z.looseObject({
    merchantType,
    [KINDS[kind].idField]: z.string().trim().min(1).max(64),
  });

export const infoInput = z.object({
  merchantType: z.preprocess((v) => (v === "" ? undefined : v), merchantType.optional()),
});

export const entry = z.looseObject({ _id: z.string(), merchantType: z.number() });
export type Entry = z.infer<typeof entry>;

export const entriesResult = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  result: z.array(entry),
});
