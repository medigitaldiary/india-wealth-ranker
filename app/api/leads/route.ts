import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/schemas";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";

/**
 * Lead capture (phone step). Validates server-side, then upserts on phone so a
 * repeat visitor updates their existing row. When DATABASE_URL is absent it
 * accepts the lead without persisting so the flow still advances.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const phone = `+91${parsed.data.phone}`;
  const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`;

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, id: null, persisted: false });
  }

  try {
    const [row] = await getDb()
      .insert(leads)
      .values({ fullName, phone })
      .onConflictDoUpdate({ target: leads.phone, set: { fullName } })
      .returning({ id: leads.id });

    return NextResponse.json({ ok: true, id: row.id, persisted: true });
  } catch (err) {
    console.error("[api/leads] insert failed:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
