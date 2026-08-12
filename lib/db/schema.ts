import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  bigint,
  varchar,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: varchar("phone", { length: 16 }).notNull().unique(), // +91XXXXXXXXXX
    phoneVerified: boolean("phone_verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // Total wealth (assets, no liabilities). Null until the reveal step runs.
    totalWealthInr: bigint("total_wealth_inr", { mode: "number" }),
  },
  (t) => [index("leads_wealth_idx").on(t.totalWealthInr)],
);

export const otpVerifications = pgTable(
  "otp_verifications",
  {
    id: serial("id").primaryKey(),
    phone: varchar("phone", { length: 16 }).notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: integer("attempts").default(0).notNull(),
    consumed: boolean("consumed").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("otp_phone_idx").on(t.phone)],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type OtpVerification = typeof otpVerifications.$inferSelect;
