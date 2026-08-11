import type { Tier } from "./benchmarks";

export interface LeaderboardProfile {
  /** Anonymized handle, e.g. "User from Mumbai" or "The Top 10% #1642". */
  displayName: string;
  badge_label: string;
  percentile_rank: number;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Builds a leaderboard-safe profile. PII (name, phone) is intentionally NOT a
 * parameter, so it is impossible for this helper to leak it — the caller passes
 * only the non-identifying fields. Prefers a city-based handle ("User from
 * Mumbai"); falls back to a numbered tier handle when no city was given.
 */
export function anonymizeForLeaderboard(input: {
  city?: string | null;
  tier: Tier;
  percentile: number;
}): LeaderboardProfile {
  const city = input.city?.trim();
  const displayName = city
    ? `User from ${titleCase(city)}`
    : `${input.tier.name} #${1000 + Math.floor(Math.random() * 9000)}`;

  return {
    displayName,
    badge_label: input.tier.name,
    percentile_rank: Math.round(input.percentile * 100) / 100,
  };
}
