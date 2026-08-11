"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Tier } from "@/lib/wealth/benchmarks";

/**
 * Full-screen milestone unlock shown when a tier is achieved. Fast, functional
 * motion (no bounce) per BondScanner: scrim fades, card lifts in over ~200ms.
 */
export function MilestoneToast({
  tier,
  show,
  levelLabel,
}: {
  tier: Tier;
  show: boolean;
  levelLabel: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: "rgba(14,18,27,0.45)", backdropFilter: "blur(2px)" }}
          aria-live="polite"
        >
          <motion.div
            className="w-full max-w-sm rounded-[var(--r-20)] border border-border-subtle bg-surface-card p-7 text-center flex flex-col items-center gap-4"
            style={{ boxShadow: "var(--shadow-xl)" }}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <span
              className="inline-flex items-center justify-center rounded-full"
              style={{
                width: 64,
                height: 64,
                background: "var(--brand-soft)",
                color: "var(--brand-accent)",
              }}
            >
              <i className={`${tier.icon} text-3xl`} aria-hidden />
            </span>
            <span
              className="text-brand-accent"
              style={{
                fontSize: "var(--overline-size)",
                letterSpacing: "var(--overline-tracking)",
                textTransform: "uppercase",
                fontWeight: "var(--weight-medium)",
              }}
            >
              {levelLabel} · Tier unlocked
            </span>
            <h2
              className="text-text-title"
              style={{
                fontSize: "var(--h3-size)",
                lineHeight: "var(--h3-line)",
                fontWeight: "var(--weight-semibold)",
              }}
            >
              {tier.name}
            </h2>
            <p
              className="text-text-body"
              style={{
                fontSize: "var(--body-sm-size)",
                lineHeight: "var(--body-sm-line)",
              }}
            >
              {tier.blurb}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
