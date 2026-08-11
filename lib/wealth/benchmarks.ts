import data from "@/data/wealthBenchmarks.json";

/**
 * Typed loader for wealthBenchmarks.json — the single source of truth for tier
 * thresholds, labels, and the percentile curve. Domain data (numbers, labels,
 * copy) lives in the JSON so it can be refined without touching code; UI-only
 * decoration (icon + Badge colour) lives here, keyed by tier id.
 */
export type TierId =
  | "rising-aspirant"
  | "comfortable-middle"
  | "top-10-percent"
  | "elite-1-percent";

export type TierColor = "gray" | "sky" | "blue" | "purple";

export interface Tier {
  id: TierId;
  /** Human label (from badge_label). */
  name: string;
  /** One-line description (from JSON description). */
  blurb: string;
  /** Absolute net-worth threshold to enter this tier (₹). */
  minNetWorth: number;
  /** Remix icon class (UI decoration). */
  icon: string;
  /** BondScanner Badge colour (UI decoration). */
  color: TierColor;
}

export interface PercentileAnchor {
  netWorth: number;
  percentile: number;
}

// UI decoration per tier — not domain data, so it stays in code.
const TIER_UI: Record<TierId, { icon: string; color: TierColor }> = {
  "rising-aspirant": { icon: "ri-seedling-line", color: "gray" },
  "comfortable-middle": { icon: "ri-home-4-line", color: "sky" },
  "top-10-percent": { icon: "ri-line-chart-line", color: "blue" },
  "elite-1-percent": { icon: "ri-vip-crown-line", color: "purple" },
};

export const TIERS: Tier[] = data.tiers.map((t) => {
  const id = t.id as TierId;
  return {
    id,
    name: t.badge_label,
    blurb: t.description,
    minNetWorth: t.min_net_worth,
    ...TIER_UI[id],
  };
});

export const TIER_BY_ID: Record<TierId, Tier> = TIERS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<TierId, Tier>,
);

/** The entry tier — used as the ≤0 default and at lead capture. */
export const ENTRY_TIER: TierId = "rising-aspirant";

export const PERCENTILE_MAP: PercentileAnchor[] = [...data.percentile_map]
  .map((a) => ({ netWorth: a.net_worth, percentile: a.percentile }))
  .sort((x, y) => x.netWorth - y.netWorth);
