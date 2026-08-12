import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { rankSchema } from "@/lib/validation/schemas";
import { totalWealth } from "@/lib/wealth/calculate";
import { calculateUserRank } from "@/lib/wealth/ranking";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";

/**
 * Computes the rank server-side (authoritative) and, when a DB is configured,
 * stores the lead's total wealth. Total wealth is recomputed here from the raw
 * amounts, never trusted from the client.
 *
 * NOTE (Phase 1 interim): still returns the old percentile/tier. Phase 2
 * replaces this with the participant-based All India Rank.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = rankSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { assets, leadId } = parsed.data;
  const wealth = totalWealth(assets);
  const rank = calculateUserRank(wealth);

  const result = {
    ok: true as const,
    totalWealth: wealth,
    percentile: rank.percentile,
    topPercent: rank.topPercent,
    tier: rank.status_tier,
    persisted: false,
  };

  if (!hasDatabase()) {
    return NextResponse.json(result);
  }

  try {
    if (leadId) {
      await getDb()
        .update(leads)
        .set({
          netWorthInr: Math.round(wealth),
          percentile: rank.percentile.toFixed(2),
          tier: rank.status_tier,
        })
        .where(eq(leads.id, leadId));
    }
    return NextResponse.json({ ...result, persisted: true });
  } catch (err) {
    console.error("[api/rank] persist failed:", err);
    return NextResponse.json(result);
  }
}
