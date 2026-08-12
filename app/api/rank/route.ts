import { NextResponse } from "next/server";
import { eq, gt, count, isNotNull } from "drizzle-orm";
import { rankSchema } from "@/lib/validation/schemas";
import { totalWealth } from "@/lib/wealth/calculate";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";

/**
 * All India Rank. Rank is computed among participants only — everyone who has
 * completed the journey (i.e. has a stored total wealth). We store this lead's
 * total wealth, then:
 *   AIR = 1 + (number of participants with MORE wealth than you).
 * Total wealth is recomputed server-side; never trusted from the client.
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
  const wealth = Math.round(totalWealth(assets));

  // Without a DB there is no participant pool to rank against.
  if (!hasDatabase()) {
    return NextResponse.json({
      ok: true,
      air: null,
      totalParticipants: null,
      totalWealth: wealth,
      persisted: false,
    });
  }

  try {
    const db = getDb();

    // Record this participant's wealth so they count in the pool.
    if (leadId) {
      await db
        .update(leads)
        .set({ netWorthInr: wealth })
        .where(eq(leads.id, leadId));
    }

    const [{ ahead }] = await db
      .select({ ahead: count() })
      .from(leads)
      .where(gt(leads.netWorthInr, wealth));

    const [{ total }] = await db
      .select({ total: count() })
      .from(leads)
      .where(isNotNull(leads.netWorthInr));

    return NextResponse.json({
      ok: true,
      air: ahead + 1,
      totalParticipants: total,
      totalWealth: wealth,
      persisted: true,
    });
  } catch (err) {
    console.error("[api/rank] AIR compute failed:", err);
    return NextResponse.json({
      ok: true,
      air: null,
      totalParticipants: null,
      totalWealth: wealth,
      persisted: false,
    });
  }
}
