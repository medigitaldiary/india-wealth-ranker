import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";

export default function LeaderboardPage() {
  return (
    <>
      <header className="w-full border-b border-border-subtle bg-surface-card">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="BondScanner home">
            <BrandLogo size={30} />
          </Link>
          <Link
            href="/rank"
            className="text-sm font-medium text-brand-accent hover:text-brand-hover transition-colors"
          >
            Check my rank →
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <span
              className="inline-flex items-center gap-2 text-brand-accent"
              style={{
                fontSize: "var(--overline-size)",
                letterSpacing: "var(--overline-tracking)",
                textTransform: "uppercase",
                fontWeight: "var(--weight-medium)",
              }}
            >
              <i className="ri-bar-chart-2-line text-base" aria-hidden />
              Global Leaderboard
            </span>
            <h1
              className="text-text-title"
              style={{
                fontSize: "var(--h2-size)",
                lineHeight: "var(--h2-line)",
                letterSpacing: "var(--h2-tracking)",
                fontWeight: "var(--weight-semibold)",
              }}
            >
              Top rankers
            </h1>
            <p
              className="text-text-body"
              style={{ fontSize: "var(--body-md-size)", lineHeight: "var(--body-md-line)" }}
            >
              India&apos;s wealthiest set the bar. Everyone else ranks in below,
              anonymized. No rupee figures, ever.
            </p>
          </header>

          <LeaderboardList />
        </div>
      </main>
    </>
  );
}
