DROP INDEX "leads_phone_idx";--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_lead_id_unique" UNIQUE("lead_id");--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_phone_unique" UNIQUE("phone");