import { randomBytes } from "node:crypto";

// 24-char hex ids in the MongoDB ObjectId layout (4-byte time + 8 random
// bytes). The frontend's URLs and stored carts already use ids of this shape,
// and existing records keep theirs when imported.
export const objectId = (): string =>
  Math.floor(Date.now() / 1000).toString(16).padStart(8, "0") + randomBytes(8).toString("hex");
