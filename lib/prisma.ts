// Compatibility shim: some modules import `{ prisma }` from "./prisma" while the
// client is defined in "./db" as `db`. Re-export it under both names.
import { db } from "./db";

export const prisma = db;
export default db;
