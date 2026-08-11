import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db/client";

/**
 * Lightweight DB connectivity probe. GET /api/health/db → { connected: true }
 * when Neon answers a trivial query. Handy for verifying env wiring without
 * opening Drizzle Studio.
 */
export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json(
      { connected: false, reason: "DATABASE_URL not set" },
      { status: 503 },
    );
  }
  try {
    await getDb().execute(sql`select 1`);
    return NextResponse.json({ connected: true });
  } catch (err) {
    console.error("[api/health/db] ping failed:", err);
    return NextResponse.json(
      { connected: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
