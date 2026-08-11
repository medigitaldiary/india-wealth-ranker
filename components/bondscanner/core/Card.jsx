"use client";
import React from "react";

/**
 * Card — the standard surface container: white, hairline stroke, soft shadow,
 * 16px radius. Compose freely; optional `title`/`action`/`subtitle` render a header.
 */
export function Card({
  title,
  subtitle,
  action,
  padding = 20,
  children,
  style,
  className = "",
  ...rest
}) {
  const hasHeader = title || action || subtitle;
  return (
    <div
      className={className}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--r-16)",
        boxShadow: "var(--shadow-xs)",
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {hasHeader && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            padding: `${padding}px ${padding}px 0`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: "var(--weight-semibold)",
                  fontSize: "var(--h5-size)",
                  lineHeight: "var(--h5-line)",
                  color: "var(--text-title)",
                  letterSpacing: "-0.004em",
                }}
              >
                {title}
              </div>
            )}
            {subtitle && (
              <div
                style={{
                  fontSize: "var(--body-sm-size)",
                  lineHeight: "var(--body-sm-line)",
                  color: "var(--text-body)",
                  marginTop: 2,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          {action && <div style={{ flex: "none" }}>{action}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}