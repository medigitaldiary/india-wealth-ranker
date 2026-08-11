"use client";
import React from "react";

/**
 * Checkbox — with optional inline label. Controlled or uncontrolled.
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  label,
  id,
  style,
  className = "",
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const fid = id || React.useId();

  function toggle(e) {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  }

  const active = on || indeterminate;
  const box = (
    <span
      style={{
        width: 18,
        height: 18,
        flex: "none",
        borderRadius: "var(--r-6)",
        border: active ? "none" : "1px solid var(--border-strong)",
        background: active ? "var(--primary-cta-button)" : "var(--surface-card)",
        boxShadow: active ? "none" : "var(--shadow-xs)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--gray-0)",
        transition: "background .12s ease,border-color .12s ease",
      }}
    >
      {indeterminate ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : on ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2l2.3 2.3 4.7-4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );

  return (
    <label
      htmlFor={fid}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: disabled ? "var(--text-disabled)" : "var(--text-title)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        userSelect: "none",
        ...style,
      }}
    >
      <input
        id={fid}
        type="checkbox"
        checked={on}
        disabled={disabled}
        onChange={toggle}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {box}
      {label}
    </label>
  );
}