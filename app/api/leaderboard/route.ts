import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leaderboardEntries } from "@/lib/db/schema";
import { calculateUserRank } from "@/lib/wealth/ranking";
import wealthiest from "@/data/wealthiestIndians.json";

export interface LeaderboardRow {
  rank: number;
  displayName: string;
  tier: string;
  percentile: number;
  /** True for pinned public benchmarks (India's wealthiest); false for real users. */
  benchmark: boolean;
  /** Company/context, benchmarks only. */
  org?: string;
}

/**
 * India's wealthiest, pinned at the top as public benchmarks. Their net worth
 * (from wealthiestIndians.json) is run through the same ranking engine so tier
 * and percentile are consistent with everyone else — but the ₹ figure is never
 * returned to the client (figure-free leaderboard).
 */
function benchmarkRows(): LeaderboardRow[] {
  return wealthiest.people.map((p, i) => {
    const r = calculateUserRank(p.netWorth);
    return {
      rank: i + 1,
      displayName: p.name,
      tier: r.status_tier,
      percentile: r.percentile,
      benchmark: true,
      org: p.org,
    };
  });
}

export async function GET() {
  const benches = benchmarkRows();

  if (!hasDatabase()) {
    return NextResponse.json({ rows: benches });
  }

  try {
    const db = getDb();
    const users = await db
      .select({
        displayName: leaderboardEntries.displayName,
        tier: leaderboardEntries.tier,
        percentile: leaderboardEntries.percentile,
      })
      .from(leaderboardEntries)
      .orderBy(desc(leaderboardEntries.percentile))
      .limit(20);

    const userRows: LeaderboardRow[] = users.map((u, i) => ({
      rank: benches.length + i + 1,
      displayName: u.displayName,
      tier: u.tier,
      percentile: Number(u.percentile),
      benchmark: false,
    }));

    return NextResponse.json({ rows: [...benches, ...userRows] });
  } catch (err) {
    console.error("[api/leaderboard] query failed:", err);
    return NextResponse.json({ rows: benches });
  }
}
