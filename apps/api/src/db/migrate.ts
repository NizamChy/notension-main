import { env } from "../env";
import { createDb } from "./client";

const handle = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await handle.migrate();
await handle.close();
console.log("migrations applied");
