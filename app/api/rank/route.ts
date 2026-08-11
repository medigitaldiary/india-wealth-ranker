import { NextResponse } from "next/server";
import { rankSchema } from "@/lib/validation/schemas";
import { netWorth as calcNetWorth } from "@/lib/wealth/calculate";
import { calculateUserRank } from "@/lib/wealth/ranking";
import { anonymizeForLeaderboard } from "@/lib/wealth/anonymize";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads, leaderboardEntries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Computes the final wealth rank server-side (authoritative), then — when a DB
 * is configured — updates the lead row and appends an anonymized leaderboard
 * entry. Net worth is recomputed here from the raw amounts, never trusted from
 * the client.
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

  const { assets, liabilities, leadId, city } = parsed.data;
  const nw = calcNetWorth(assets, liabilities);
  const rank = calculateUserRank(nw); // handles ≤0 → rising-aspirant

  const result = {
    ok: true as const,
    netWorth: nw,
    percentile: rank.percentile,
    topPercent: rank.topPercent,
    tier: rank.status_tier,
    persisted: false,
  };

  if (!hasDatabase()) {
    return NextResponse.json(result);
  }

  try {
    const db = getDb();
    const pctStr = rank.percentile.toFixed(2);

    if (leadId) {
      await db
        .update(leads)
        .set({ netWorthInr: Math.round(nw), percentile: pctStr, tier: rank.status_tier })
        .where(eq(leads.id, leadId));
    }

    // Anonymized leaderboard entry — PII stripped by the helper (PRD §4.4).
    const profile = anonymizeForLeaderboard({
      city,
      tier: rank.tier,
      percentile: rank.percentile,
    });
    await db.insert(leaderboardEntries).values({
      leadId: leadId ?? null,
      displayName: profile.displayName,
      tier: rank.status_tier,
      percentile: pctStr,
    });

    return NextResponse.json({ ...result, persisted: true });
  } catch (err) {
    console.error("[api/rank] persist failed:", err);
    // Still return the computed rank — persistence is best-effort.
    return NextResponse.json(result);
  }
}
