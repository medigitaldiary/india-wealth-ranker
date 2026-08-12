"use client";

import { useRef } from "react";

/**
 * Six single-digit boxes for OTP entry, with auto-advance, backspace-to-prev,
 * and paste support. Controlled via `value` (up to `length` digits).
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  error,
  length = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  disabled?: boolean;
  error?: boolean;
  length?: number;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const commit = (next: string) => {
    const trimmed = next.slice(0, length);
    onChange(trimmed);
    if (trimmed.length === length) onComplete?.(trimmed);
  };

  const handleChange = (i: number, raw: string) => {
    const only = raw.replace(/\D/g, "");
    const arr = [...digits];
    if (only === "") {
      arr[i] = "";
      onChange(arr.join(""));
      return;
    }
    let idx = i;
    for (const ch of only.split("")) {
      if (idx < length) {
        arr[idx] = ch;
        idx++;
      }
    }
    commit(arr.join(""));
    refs.current[Math.min(idx, length - 1)]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (text) {
      e.preventDefault();
      commit(text);
      refs.current[Math.min(text.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center" role="group" aria-label="One-time passcode">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="num w-11 h-14 sm:w-12 sm:h-14 text-center outline-none transition-colors"
          style={{
            fontSize: "var(--h3-size)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--text-title)",
            background: "var(--surface-card)",
            border: `1px solid ${error ? "var(--state-error-base)" : "var(--border-default)"}`,
            borderRadius: "var(--r-10)",
            boxShadow: "var(--shadow-xs)",
          }}
        />
      ))}
    </div>
  );
}
