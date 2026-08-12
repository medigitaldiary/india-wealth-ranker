"use client";

import { usePathname } from "next/navigation";

const STEPS = [
  { match: "/rank", label: "Wealth" },
  { match: "/rank/details", label: "You" },
  { match: "/rank/verify", label: "Verify" },
  { match: "/rank/reveal", label: "Rank" },
];

function currentIndex(pathname: string): number {
  // Longest matching prefix wins so /rank/portfolio beats /rank.
  let idx = 0;
  let best = -1;
  STEPS.forEach((s, i) => {
    const hit = pathname === s.match || pathname.startsWith(s.match + "/");
    if (hit && s.match.length > best) {
      best = s.match.length;
      idx = i;
    }
  });
  return idx;
}

export function QuestProgress() {
  const pathname = usePathname();
  const active = currentIndex(pathname);

  return (
    <div className="flex items-center gap-2" aria-label={`Step ${active + 1} of ${STEPS.length}`}>
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => {
          const done = i < active;
          const isCurrent = i === active;
          return (
            <span
              key={s.match}
              title={s.label}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: isCurrent ? 20 : 8,
                background:
                  done || isCurrent
                    ? "var(--brand-accent)"
                    : "var(--border-default)",
              }}
            />
          );
        })}
      </div>
      <span
        className="text-text-muted hidden sm:inline"
        style={{
          fontSize: "var(--overline-size)",
          letterSpacing: "var(--overline-tracking)",
          textTransform: "uppercase",
          fontWeight: "var(--weight-medium)",
        }}
      >
        {STEPS[active].label}
      </span>
    </div>
  );
}
