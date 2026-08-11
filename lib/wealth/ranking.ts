import {
  PERCENTILE_MAP,
  TIERS,
  TIER_BY_ID,
  ENTRY_TIER,
  type Tier,
  type TierId,
} from "./benchmarks";

/**
 * The Ranking Engine. Reads exclusively from wealthBenchmarks.json (via
 * benchmarks.ts) — no live data, no scraping. Wealth grows roughly
 * exponentially, so the percentile curve is interpolated log-linearly between
 * the map's anchor points for a smooth result across ₹50k → ₹100cr.
 */
const FIRST = PERCENTILE_MAP[0];
const LAST = PERCENTILE_MAP[PERCENTILE_MAP.length - 1];

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

/** Percentile (0–100) at or below which this net worth sits. */
export function percentileForNetWorth(netWorth: number): number {
  if (!Number.isFinite(netWorth) || netWorth <= 0) return 1;
  if (netWorth <= FIRST.netWorth)
    return clamp((netWorth / FIRST.netWorth) * FIRST.percentile, 0.5, FIRST.percentile);
  if (netWorth >= LAST.netWorth) return LAST.percentile;

  for (let i = 0; i < PERCENTILE_MAP.length - 1; i++) {
    const lo = PERCENTILE_MAP[i];
    const hi = PERCENTILE_MAP[i + 1];
    if (netWorth >= lo.netWorth && netWorth <= hi.netWorth) {
      const frac =
        (Math.log(netWorth) - Math.log(lo.netWorth)) /
        (Math.log(hi.netWorth) - Math.log(lo.netWorth));
      return lo.percentile + frac * (hi.percentile - lo.percentile);
    }
  }
  return LAST.percentile;
}

/** Inverse: the net-worth threshold to reach a given percentile. */
export function thresholdForPercentile(p: number): number {
  if (p <= FIRST.percentile) return FIRST.netWorth;
  if (p >= LAST.percentile) return LAST.netWorth;

  for (let i = 0; i < PERCENTILE_MAP.length - 1; i++) {
    const lo = PERCENTILE_MAP[i];
    const hi = PERCENTILE_MAP[i + 1];
    if (p >= lo.percentile && p <= hi.percentile) {
      const frac = (p - lo.percentile) / (hi.percentile - lo.percentile);
      return Math.round(
        Math.exp(
          Math.log(lo.netWorth) + frac * (Math.log(hi.netWorth) - Math.log(lo.netWorth)),
        ),
      );
    }
  }
  return LAST.netWorth;
}

/**
 * Tier from absolute net worth. Critical constraint: net worth ≤ 0 defaults to
 * the entry-level "Rising Aspirant" tier.
 */
export function tierForNetWorth(netWorth: number): Tier {
  if (!Number.isFinite(netWorth) || netWorth <= 0) return TIER_BY_ID[ENTRY_TIER];
  let match = TIERS[0];
  for (const t of TIERS) if (netWorth >= t.minNetWorth) match = t;
  return match;
}

export interface UserRank {
  netWorth: number;
  status_tier: TierId;
  tier: Tier;
  badge_label: string;
  /** Percentile you sit at (0–100), 2 dp. */
  percentile: number;
  /** Headline "top X%" figure (100 − percentile). */
  topPercent: number;
}

/**
 * The headline function: net worth → tier + percentile. Handles the ≤0 edge
 * case (bottom percentile, entry tier) via the helpers above.
 */
export function calculateUserRank(netWorth: number): UserRank {
  const tier = tierForNetWorth(netWorth);
  const percentile = Math.round(percentileForNetWorth(netWorth) * 100) / 100;
  return {
    netWorth,
    status_tier: tier.id,
    tier,
    badge_label: tier.name,
    percentile,
    topPercent: Math.round((100 - percentile) * 100) / 100,
  };
}

export interface RankComparison extends UserRank {
  median: number;
  top10Threshold: number;
  top1Threshold: number;
  /** How many times the median Indian adult you are worth. */
  vsMedian: number;
  /** Rupees still needed to reach the Elite 1% (0 if already there). */
  toTop1: number;
}

/** Extended stats for the reveal card (tier/percentile + benchmarks). */
export function buildComparison(netWorth: number): RankComparison {
  const base = calculateUserRank(netWorth);
  const median = thresholdForPercentile(50);
  const top1Threshold = thresholdForPercentile(99);
  return {
    ...base,
    median,
    top10Threshold: thresholdForPercentile(90),
    top1Threshold,
    vsMedian: median > 0 ? Math.max(0, netWorth) / median : 0,
    toTop1: Math.max(0, top1Threshold - netWorth),
  };
}

/** "Top 0.8%" / "Top 15%" — one decimal below 10, integer above. */
export function formatTopPercent(topPercent: number): string {
  if (topPercent < 10) return `${topPercent.toFixed(1)}%`;
  return `${Math.round(topPercent)}%`;
}
