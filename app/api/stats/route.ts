import { NextResponse } from "next/server";
import { count, isNotNull } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { withCors, corsPreflight } from "@/lib/http/cors";

/**
 * Public pool stats for the landing's trust markers — how many participants
 * have completed a ranking. Real, live number (grows as people play).
 *
 * Called cross-origin from bondscanner.com/wealth-air.
 */
export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function GET(req: Request) {
  return withCors(req, await handleGet());
}

async function handleGet() {
  if (!hasDatabase()) return NextResponse.json({ count: 0 });
  try {
    const db = getDb();
    const [{ n }] = await db
      .select({ n: count() })
      .from(leads)
      .where(isNotNull(leads.totalWealthInr));
    return NextResponse.json({ count: n });
  } catch (err) {
    console.error("[api/stats] failed:", err);
    return NextResponse.json({ count: 0 });
  }
}
