"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import CountUp from "react-countup";
import { LogoMark } from "@/components/bondscanner/brand/Logo";
import { TierBadge } from "./TierBadge";
import { ShareCard } from "./ShareCard";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { totalWealth } from "@/lib/wealth/calculate";
import { buildComparison, formatTopPercent } from "@/lib/wealth/ranking";
import { formatInr } from "@/lib/utils";
import { BONDSCANNER_URL } from "@/lib/config";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

// NOTE (Phase 1 interim): the hero still shows the old "Top X%" percentile.
// Phase 2 swaps this for the participant-based All India Rank number.
export function RankReveal() {
  const router = useRouter();
  const hydrated = useHydrated();
  const firstName = useQuestStore((s) => s.firstName);
  const phoneVerified = useQuestStore((s) => s.phoneVerified);
  const assets = useQuestStore((s) => s.assets);
  const leadId = useQuestStore((s) => s.leadId);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  const [phase, setPhase] = useState<"calculating" | "revealed">("calculating");
  const posted = useRef(false);

  const wealth = totalWealth(assets);
  const comparison = buildComparison(wealth);
  const tier = comparison.tier;

  // Funnel guard: name entered and phone verified.
  useEffect(() => {
    if (hydrated && (!firstName || !phoneVerified)) router.replace("/rank");
  }, [hydrated, firstName, phoneVerified, router]);

  // Reveal sequence + persist (once).
  useEffect(() => {
    if (!hydrated || !firstName || !phoneVerified) return;
    const t = setTimeout(() => setPhase("revealed"), 1100);

    if (!posted.current) {
      posted.current = true;
      reachLevel(3);
      fetch("/api/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assets, leadId }),
      }).catch(() => {
        /* persistence is best-effort; the reveal is client-computed */
      });
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, firstName, phoneVerified]);

  if (!hydrated || !firstName || !phoneVerified) return null;

  if (phase === "calculating") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <motion.span
          className="inline-flex items-center justify-center rounded-full"
          style={{ width: 72, height: 72, background: "var(--brand-soft)", color: "var(--brand-accent)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
        >
          <i className="ri-compass-3-line text-4xl" aria-hidden />
        </motion.span>
        <p className="text-text-body" style={{ fontSize: "var(--body-lg-size)" }}>
          Ranking you against India&apos;s wealth distribution…
        </p>
      </div>
    );
  }

  const topLabel = formatTopPercent(comparison.topPercent);
  const isElite = tier.id === "elite-1-percent";

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        className="rounded-[var(--r-20)] border border-border-subtle bg-surface-card p-7 sm:p-9 text-center flex flex-col items-center gap-4"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <span
          className="text-text-muted"
          style={{
            fontSize: "var(--overline-size)",
            letterSpacing: "var(--overline-tracking)",
            textTransform: "uppercase",
            fontWeight: "var(--weight-medium)",
          }}
        >
          {firstName}, you rank in the
        </span>
        <div
          className="num text-brand"
          style={{
            fontSize: "clamp(2.75rem, 12vw, var(--display-xl-size))",
            lineHeight: 1,
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--display-xl-tracking)",
          }}
        >
          Top{" "}
          <CountUp
            end={comparison.topPercent}
            decimals={comparison.topPercent < 10 ? 1 : 0}
            duration={1.4}
            suffix="%"
          />
        </div>
        <span className="text-text-body" style={{ fontSize: "var(--body-md-size)" }}>
          of India&apos;s wealth hierarchy
        </span>
        <div className="pt-1">
          <TierBadge tier={tier} />
        </div>
      </motion.div>

      {/* Total wealth */}
      <motion.div variants={fadeUp}>
        <StatRow label="Your total wealth" value={`₹${inr.format(Math.round(wealth))}`} />
      </motion.div>

      {/* Comparison */}
      <motion.div
        variants={fadeUp}
        className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 flex flex-col gap-4"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <h2
          className="text-text-title"
          style={{ fontSize: "var(--h5-size)", fontWeight: "var(--weight-semibold)" }}
        >
          How you compare
        </h2>
        <CompareLine
          icon="ri-group-line"
          label="Ahead of"
          value={`${Math.round(comparison.percentile)}% of Indians`}
        />
        <CompareLine
          icon="ri-scales-2-line"
          label="Worth"
          value={`${comparison.vsMedian >= 1 ? comparison.vsMedian.toFixed(1) : comparison.vsMedian.toFixed(2)}× the median adult`}
        />
        {isElite ? (
          <CompareLine
            icon="ri-vip-crown-line"
            label="Status"
            value="You've reached the top 1%."
            highlight
          />
        ) : (
          <CompareLine
            icon="ri-arrow-up-line"
            label="To Elite 1%"
            value={`${formatInr(comparison.toTop1)} to go`}
          />
        )}
        <p className="text-text-muted" style={{ fontSize: "var(--body-xs-size)" }}>
          Estimates based on India&apos;s wealth distribution. For guidance, not
          financial advice.
        </p>
      </motion.div>

      {/* Share */}
      <motion.div variants={fadeUp}>
        <ShareCard topPercentLabel={topLabel} tierName={tier.name} />
      </motion.div>

      {/* Bonds CTA */}
      <motion.a
        variants={fadeUp}
        href={BONDSCANNER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-[var(--r-16)] p-6 flex items-center gap-4 group"
        style={{ background: "var(--brand)", boxShadow: "var(--shadow-md)" }}
      >
        <span
          className="inline-flex items-center justify-center rounded-full shrink-0"
          style={{ width: 48, height: 48, background: "rgba(255,255,255,0.12)" }}
        >
          <LogoMark size={26} color="var(--gray-0)" />
        </span>
        <span className="flex flex-col">
          <span
            className="text-[var(--text-on-brand)]"
            style={{ fontSize: "var(--body-lg-size)", fontWeight: "var(--weight-semibold)" }}
          >
            Grow my rank with Bonds
          </span>
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "var(--body-sm-size)" }}>
            Secured, rated corporate bonds on BondScanner
          </span>
        </span>
        <i
          className="ri-arrow-right-line text-2xl ml-auto text-[var(--text-on-brand)] transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </motion.a>
    </motion.div>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card px-5 py-4 flex items-center justify-between gap-4"
      style={{ boxShadow: "var(--shadow-xs)" }}
    >
      <span
        className="text-text-muted"
        style={{
          fontSize: "var(--overline-size)",
          letterSpacing: "var(--overline-tracking)",
          textTransform: "uppercase",
          fontWeight: "var(--weight-medium)",
        }}
      >
        {label}
      </span>
      <span
        className="num text-brand"
        style={{
          fontSize: "var(--data-lg-size)",
          lineHeight: "var(--data-lg-line)",
          fontWeight: "var(--weight-semibold)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function CompareLine({
  icon,
  label,
  value,
  highlight,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <i
        className={`${icon} text-lg`}
        style={{ color: highlight ? "var(--brand-accent)" : "var(--text-muted)" }}
        aria-hidden
      />
      <span className="text-text-muted" style={{ fontSize: "var(--body-sm-size)" }}>
        {label}
      </span>
      <span
        className="ml-auto text-text-title num"
        style={{ fontSize: "var(--body-md-size)", fontWeight: "var(--weight-medium)" }}
      >
        {value}
      </span>
    </div>
  );
}
