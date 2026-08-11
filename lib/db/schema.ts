import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  bigint,
  numeric,
  varchar,
  index,
} from "drizzle-orm/pg-core";

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    fullName: text("full_name").notNull(),
    phone: varchar("phone", { length: 16 }).notNull(), // +91XXXXXXXXXX
    city: text("city"), // optional; powers "User from <city>" leaderboard handle
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // Denormalised final rank so we can pull leaderboard fast.
    netWorthInr: bigint("net_worth_inr", { mode: "number" }),
    percentile: numeric("percentile", { precision: 5, scale: 2 }),
    tier: text("tier"), // 'rising-aspirant' | 'comfortable-middle' | 'top-10-percent' | 'elite-1-percent'
  },
  (t) => [index("leads_phone_idx").on(t.phone)],
);

export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id").references(() => leads.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(), // anonymised, e.g. "Aspirant #482"
    tier: text("tier").notNull(),
    percentile: numeric("percentile", { precision: 5, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("leaderboard_percentile_idx").on(t.percentile)],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
