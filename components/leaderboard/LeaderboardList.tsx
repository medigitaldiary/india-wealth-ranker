"use client";

import { useEffect, useState } from "react";
import { TierBadge } from "@/components/quest/TierBadge";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { TIER_BY_ID, type TierId } from "@/lib/wealth/benchmarks";
import { formatTopPercent } from "@/lib/wealth/ranking";

interface Row {
  rank: number;
  displayName: string;
  tier: string;
  percentile: number;
  benchmark: boolean;
  org?: string;
}

export function LeaderboardList() {
  const hydrated = useHydrated();
  const myTier = useQuestStore((s) => s.tier);
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => setRows(d.rows))
      .catch(() => setRows([]));
  }, []);

  if (!rows) {
    return (
      <div className="flex flex-col gap-2 animate-pulse" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-[var(--r-12)] bg-surface-sunken border border-border-subtle"
          />
        ))}
      </div>
    );
  }

  const hasUsers = rows.some((r) => !r.benchmark);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-muted" style={{ fontSize: "var(--body-xs-size)" }}>
        {hasUsers
          ? "The top 10 are India's wealthiest, shown as public benchmarks. Everyone below is a real, anonymized player."
          : "The top 10 are India's wealthiest, shown as public benchmarks. Finish your quest to be the first player on the board."}
      </p>

      <ol className="flex flex-col gap-2">
        {rows.map((row) => {
          const tier = TIER_BY_ID[row.tier as TierId];
          const mine = !row.benchmark && hydrated && myTier === row.tier;
          return (
            <li
              key={`${row.rank}-${row.displayName}`}
              className="flex items-center gap-3 rounded-[var(--r-12)] border bg-surface-card px-4 py-3"
              style={{
                boxShadow: "var(--shadow-xs)",
                borderColor: mine ? "var(--brand-accent)" : "var(--border-subtle)",
              }}
            >
              <span
                className="num text-text-muted w-6 text-center shrink-0"
                style={{ fontSize: "var(--body-sm-size)", fontWeight: "var(--weight-semibold)" }}
              >
                {row.rank}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span
                  className="text-text-title truncate"
                  style={{ fontSize: "var(--body-md-size)", fontWeight: "var(--weight-medium)" }}
                >
                  {row.displayName}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  {tier && <TierBadge tier={tier} size="sm" />}
                  {row.benchmark && row.org && (
                    <span className="text-text-muted truncate" style={{ fontSize: "var(--body-xs-size)" }}>
                      {row.org}
                    </span>
                  )}
                </div>
              </div>

              {row.benchmark ? (
                <span
                  className="ml-auto inline-flex items-center gap-1 shrink-0 text-text-muted"
                  style={{
                    fontSize: "var(--overline-size)",
                    letterSpacing: "var(--overline-tracking)",
                    textTransform: "uppercase",
                    fontWeight: "var(--weight-medium)",
                  }}
                >
                  <i className="ri-vip-crown-line text-sm text-brand-accent" aria-hidden />
                  Benchmark
                </span>
              ) : (
                <span
                  className="num ml-auto text-brand shrink-0"
                  style={{ fontSize: "var(--body-md-size)", fontWeight: "var(--weight-semibold)" }}
                >
                  Top {formatTopPercent(Math.round((100 - row.percentile) * 100) / 100)}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-text-muted" style={{ fontSize: "var(--body-xs-size)" }}>
        Wealthiest figures are approximate public estimates, shown for comparison only.
      </p>
    </div>
  );
}
