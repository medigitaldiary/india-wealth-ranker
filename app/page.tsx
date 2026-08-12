import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SignUpButton } from "@/components/SignUpButton";
import { ResetQuest } from "@/components/quest/ResetQuest";

export default function LandingPage() {
  return (
    <>
      <ResetQuest />
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
            Find your AIR · A BondScanner tool
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
            What&apos;s your All India Wealth Rank?
          </h1>

          {/* Subhead */}
          <p
            className="max-w-xl text-text-body"
            style={{
              fontSize: "var(--body-lg-size)",
              lineHeight: "var(--body-lg-line)",
            }}
          >
            Add up what you own, and in under a minute find out exactly where
            you rank among everyone who&apos;s played.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 w-full sm:w-auto">
            <Link
              href="/rank"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[var(--r-10)] bg-brand text-[var(--text-on-brand)] font-medium text-base hover:bg-brand-hover active:translate-y-[0.5px] transition-all w-full sm:w-auto"
              style={{ boxShadow: "var(--shadow-button-primary)" }}
            >
              Find my rank
              <i className="ri-arrow-right-line text-lg" aria-hidden />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
