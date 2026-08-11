"use client";
import React from "react";

/**
 * Tabs — underline-style segmented navigation. Controlled via `value`/`onChange`
 * or uncontrolled with `defaultValue`. `items` is [{ value, label, icon?, badge? }].
 */
export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  style,
  className = "",
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(
    defaultValue ?? (items[0] && items[0].value)
  );
  const active = isControlled ? value : internal;

  function select(v) {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  }

  return (
    <div
      className={className}
      role="tablist"
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid var(--border-subtle)",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...rest}
    >
      {items.map((it) => {
        const on = it.value === active;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={on}
            onClick={() => select(it.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 12px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: "var(--weight-medium)",
              color: on ? "var(--text-title)" : "var(--text-body)",
              boxShadow: on ? "inset 0 -2px 0 0 var(--primary-cta-button)" : "none",
              marginBottom: -1,
              transition: "color .12s ease",
              whiteSpace: "nowrap",
            }}
          >
            {it.icon && <span style={{ fontSize: 18, display: "inline-flex" }}>{it.icon}</span>}
            {it.label}
            {it.badge != null && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "var(--weight-medium)",
                  background: on ? "var(--brand-soft)" : "var(--surface-sunken)",
                  color: on ? "var(--brand-accent)" : "var(--text-body)",
                  borderRadius: "var(--r-full)",
                  padding: "1px 7px",
                  lineHeight: "16px",
                }}
              >
                {it.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}