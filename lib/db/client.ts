import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DB | null = null;

/**
 * Lazily construct the Drizzle/Neon client. Constructing eagerly would call
 * `neon()` at import time and throw when DATABASE_URL is unset (local dev
 * before Neon is wired). Callers should guard with `hasDatabase()` first.
 */
export function getDb(): DB {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — cannot open a database connection.",
    );
  }
  _db = drizzle(neon(url), { schema });
  return _db;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
