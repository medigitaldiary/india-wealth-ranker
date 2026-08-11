"use client";

import { Input } from "@/components/bondscanner/forms/Input";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/**
 * Currency input built on the BondScanner Input. Displays Indian-grouped
 * digits (₹12,40,500) while storing a plain number. Cursor sits at the end,
 * which matches how amounts are typed (left-to-right).
 */
export function CurrencyField({
  label,
  hint,
  icon,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  icon?: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const display = value > 0 ? inr.format(value) : "";

  return (
    <Input
      label={label}
      hint={hint}
      size="lg"
      inputMode="numeric"
      placeholder="0"
      leadingIcon={
        <span className="num text-text-body" style={{ fontWeight: 500 }}>
          ₹
        </span>
      }
      trailing={icon ? <i className={icon} aria-hidden /> : undefined}
      value={display}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 13);
        onChange(digits ? parseInt(digits, 10) : 0);
      }}
    />
  );
}
