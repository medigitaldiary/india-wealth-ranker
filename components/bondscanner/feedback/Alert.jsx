"use client";
import React from "react";

const MAP = {
  info: { base: "var(--state-information-base)", lighter: "var(--state-information-lighter)", icon: "ri-information-2-line" },
  success: { base: "var(--state-success-base)", lighter: "var(--state-success-lighter)", icon: "ri-checkbox-circle-line" },
  warning: { base: "var(--state-warning-base)", lighter: "var(--state-warning-lighter)", icon: "ri-error-warning-line" },
  error: { base: "var(--state-error-base)", lighter: "var(--state-error-lighter)", icon: "ri-close-circle-line" },
};

/**
 * Alert — inline notification banner with semantic color, icon, and optional
 * dismiss. `filled` uses a tinted surface; `stroke` uses white + colored edge.
 */
export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onClose,
  fill = "soft",
  style,
  className = "",
  ...rest
}) {
  const m = MAP[variant] || MAP.info;
  const soft = fill === "soft";
  return (
    <div
      className={className}
      role="status"
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        borderRadius: "var(--r-12)",
        background: soft ? m.lighter : "var(--surface-card)",
        border: `1px solid ${soft ? "transparent" : "var(--border-subtle)"}`,
        boxShadow: soft ? "none" : "var(--shadow-xs)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ color: m.base, fontSize: 20, lineHeight: "20px", flex: "none", marginTop: 1 }}>
        {icon || <i className={m.icon} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{ fontSize: 14, fontWeight: "var(--weight-semibold)", color: "var(--text-title)", lineHeight: "20px" }}>
            {title}
          </div>
        )}
        {children && (
          <div style={{ fontSize: 14, color: "var(--text-body)", lineHeight: "20px", marginTop: title ? 2 : 0 }}>
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            flex: "none",
            border: "none",
            background: "transparent",
            color: "var(--icon-soft-400)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: "20px",
            padding: 0,
            display: "inline-flex",
          }}
        >
          <i className="ri-close-line" />
        </button>
      )}
    </div>
  );
}