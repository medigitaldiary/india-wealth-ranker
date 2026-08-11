"use client";

import CountUp from "react-countup";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/**
 * Live running total with a ticker animation (PRD §6: "ticker-style animations
 * for real-time rank updates as data is entered"). Rendered sticky above the
 * input groups; `value` updates on every keystroke and CountUp rolls to it.
 */
export function NetWorthTicker({
  value,
  label,
  tone = "brand",
}: {
  value: number;
  label: string;
  tone?: "brand" | "auto";
}) {
  const negative = value < 0;
  const color =
    tone === "auto" && negative ? "var(--state-error-base)" : "var(--brand)";

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
        className="num"
        style={{
          color,
          fontSize: "var(--data-lg-size)",
          lineHeight: "var(--data-lg-line)",
          fontWeight: "var(--weight-semibold)",
        }}
      >
        {negative ? "−" : ""}₹
        <CountUp
          end={Math.abs(value)}
          duration={0.6}
          preserveValue
          formattingFn={(n) => inr.format(Math.round(n))}
        />
      </span>
    </div>
  );
}
