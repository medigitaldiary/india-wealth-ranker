"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import CountUp from "react-countup";
import { LogoMark } from "@/components/bondscanner/brand/Logo";
import { ShareCard } from "./ShareCard";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { totalWealth } from "@/lib/wealth/calculate";
import { BONDSCANNER_URL } from "@/lib/config";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

interface RankResult {
  air: number | null;
  totalParticipants: number | null;
  totalWealth: number;
}

export function RankReveal() {
  const router = useRouter();
  const hydrated = useHydrated();
  const firstName = useQuestStore((s) => s.firstName);
  const phoneVerified = useQuestStore((s) => s.phoneVerified);
  const assets = useQuestStore((s) => s.assets);
  const leadId = useQuestStore((s) => s.leadId);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  const [result, setResult] = useState<RankResult | null>(null);
  const [errored, setErrored] = useState(false);
  const posted = useRef(false);

  const wealth = totalWealth(assets);

  // Funnel guard.
  useEffect(() => {
    if (hydrated && (!firstName || !phoneVerified)) router.replace("/rank");
  }, [hydrated, firstName, phoneVerified, router]);

  // Compute the rank (once), against the live participant pool.
  useEffect(() => {
    if (!hydrated || !firstName || !phoneVerified || posted.current) return;
    posted.current = true;
    reachLevel(3);
    fetch("/api/rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assets, leadId }),
    })
      .then((r) => r.json())
      .then((d) =>
        setResult({
          air: d.air ?? null,
          totalParticipants: d.totalParticipants ?? null,
          totalWealth: typeof d.totalWealth === "number" ? d.totalWealth : wealth,
        }),
      )
      .catch(() => setErrored(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, firstName, phoneVerified]);

  if (!hydrated || !firstName || !phoneVerified) return null;

  if (!result && !errored) {
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
          Ranking you against everyone who&apos;s played…
        </p>
      </div>
    );
  }

  const shownWealth = result?.totalWealth ?? wealth;
  const air = result?.air ?? null;
  const total = result?.totalParticipants ?? null;
  const ahead = air !== null && total !== null ? Math.max(0, total - air) : null;
  const rankLabel = air !== null ? `#${inr.format(air)}` : "—";

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.12 } } }}
    >
      {/* Hero — the AIR number */}
      <motion.div
        variants={fadeUp}
        className="rounded-[var(--r-20)] border border-border-subtle bg-surface-card p-7 sm:p-9 text-center flex flex-col items-center gap-3"
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
          {firstName}, your All India Rank is
        </span>
        <div
          className="num text-brand"
          style={{
            fontSize: "clamp(2.75rem, 13vw, var(--display-xl-size))",
            lineHeight: 1,
            fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--display-xl-tracking)",
          }}
        >
          {air !== null ? (
            <>
              #
              <CountUp end={air} duration={1.4} separator="," />
            </>
          ) : (
            rankLabel
          )}
        </div>
        <span className="text-text-body" style={{ fontSize: "var(--body-md-size)" }}>
          by total wealth in India
        </span>
      </motion.div>

      {/* Total wealth */}
      <motion.div variants={fadeUp}>
        <StatRow label="Your total wealth" value={`₹${inr.format(Math.round(shownWealth))}`} />
      </motion.div>

      {/* How you stack up — total participants lives here, not next to the rank */}
      <motion.div
        variants={fadeUp}
        className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 flex flex-col gap-4"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <h2
          className="text-text-title"
          style={{ fontSize: "var(--h5-size)", fontWeight: "var(--weight-semibold)" }}
        >
          How you stack up
        </h2>
        {ahead !== null && (
          <CompareLine
            icon="ri-group-line"
            label="Ahead of"
            value={`${inr.format(ahead)} ${ahead === 1 ? "player" : "players"}`}
          />
        )}
        {total !== null && (
          <CompareLine
            icon="ri-flag-line"
            label="Players so far"
            value={inr.format(total)}
          />
        )}
        <p className="text-text-muted" style={{ fontSize: "var(--body-xs-size)" }}>
          Your rank is live and climbs or slips as more people play. For
          guidance, not financial advice.
        </p>
      </motion.div>

      {/* Share */}
      {air !== null && (
        <motion.div variants={fadeUp}>
          <ShareCard rankLabel={rankLabel} />
        </motion.div>
      )}

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

function CompareLine({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <i className={`${icon} text-lg text-text-muted`} aria-hidden />
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
