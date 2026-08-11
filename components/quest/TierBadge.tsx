"use client";

import { Badge } from "@/components/bondscanner/core/Badge";
import type { Tier } from "@/lib/wealth/benchmarks";

export function TierBadge({ tier, size = "md" }: { tier: Tier; size?: "sm" | "md" }) {
  return (
    <Badge
      color={tier.color}
      variant="light"
      size={size}
      leadingIcon={<i className={tier.icon} aria-hidden />}
    >
      {tier.name}
    </Badge>
  );
}
