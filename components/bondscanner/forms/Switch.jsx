"use client";
import React from "react";

/**
 * Switch — boolean toggle. Controlled via `checked` + `onChange`, or
 * uncontrolled with `defaultChecked`.
 */
export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  id,
  style,
  className = "",
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const dims =
    size === "sm"
      ? { w: 32, h: 18, k: 14 }
      : { w: 40, h: 22, k: 18 };

  function toggle(e) {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on, e);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={toggle}
      id={id}
      className={className}
      style={{
        width: dims.w,
        height: dims.h,
        flex: "none",
        borderRadius: "var(--r-full)",
        border: "none",
        padding: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        background: on
          ? "var(--primary-cta-button)"
          : "var(--bg-soft-200)",
        opacity: disabled ? 0.5 : 1,
        transition: "background .18s ease",
        display: "inline-flex",
        alignItems: "center",
        boxShadow: "var(--shadow-xs)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          width: dims.k,
          height: dims.k,
          borderRadius: "var(--r-full)",
          background: "var(--gray-0)",
          boxShadow: "var(--shadow-toggle)",
          transform: on ? `translateX(${dims.w - dims.k - 4}px)` : "translateX(0)",
          transition: "transform .18s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </button>
  );
}