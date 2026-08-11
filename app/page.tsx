import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SignUpButton } from "@/components/SignUpButton";

export default function LandingPage() {
  return (
    <>
      {/* Top bar */}
      <header className="w-full border-b border-border-subtle bg-surface-card">
        <div className="mx-auto max-w-[1216px] px-6 h-16 flex items-center justify-between">
          <BrandLogo size={32} />
          <SignUpButton />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-3xl flex flex-col items-center text-center gap-7">
          {/* Overline / eyebrow */}
          <span
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-brand-soft px-3.5 py-1.5 text-brand-accent"
            style={{
              fontSize: "var(--overline-size)",
              lineHeight: "var(--overline-line)",
              fontWeight: "var(--weight-medium)",
              letterSpacing: "var(--overline-tracking)",
              textTransform: "uppercase",
            }}
          >
            <i className="ri-compass-3-line text-base" aria-hidden />
            A BondScanner tool
          </span>

          {/* Headline */}
          <h1
            className="text-text-title"
            style={{
              fontSize: "clamp(2.25rem, 6vw, var(--display-lg-size))",
              lineHeight: 1.05,
              fontWeight: "var(--weight-semibold)",
              letterSpacing: "var(--display-lg-tracking)",
            }}
          >
            Where do you stand in India&apos;s wealth hierarchy?
          </h1>

          {/* Subhead */}
          <p
            className="max-w-xl text-text-body"
            style={{
              fontSize: "var(--body-lg-size)",
              lineHeight: "var(--body-lg-line)",
            }}
          >
            In about a minute you&apos;ll see your exact wealth percentile, and
            just how close you are to India&apos;s top 1%.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 w-full sm:w-auto">
            <Link
              href="/rank"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--r-10)] bg-brand text-[var(--text-on-brand)] font-medium text-base hover:bg-brand-hover active:translate-y-[0.5px] transition-all w-full sm:w-auto"
              style={{ boxShadow: "var(--shadow-button-primary)" }}
            >
              Reveal my rank
              <i className="ri-arrow-right-line text-lg" aria-hidden />
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--r-10)] bg-surface-card text-text-title border border-border-default font-medium text-base hover:bg-surface-sunken hover:border-border-strong active:translate-y-[0.5px] transition-all w-full sm:w-auto"
              style={{ boxShadow: "var(--shadow-xs)" }}
            >
              <i className="ri-bar-chart-2-line text-lg" aria-hidden />
              Global Leaderboard
            </Link>
          </div>

          {/* Trust strip — crystal card */}
          <div
            className="mt-10 w-full rounded-[var(--r-16)] border border-border-subtle bg-surface-card px-6 py-6 grid grid-cols-3 gap-4"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <Stat value="10,000+" label="Ranks calculated" />
            <Stat value="Top 1%" label="Elite tier tracked" />
            <Stat value="60 sec" label="To your result" />
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <span
        className="num text-brand"
        style={{
          fontSize: "var(--data-md-size)",
          lineHeight: "var(--data-md-line)",
          fontWeight: "var(--weight-semibold)",
        }}
      >
        {value}
      </span>
      <span className="text-xs sm:text-sm text-text-muted text-center">
        {label}
      </span>
    </div>
  );
}
