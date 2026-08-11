"use client";
import React from "react";

let injected = false;
function useBadgeStyles() {
  React.useEffect(() => {
    if (injected || typeof document === "undefined") return;
    injected = true;
    const el = document.createElement("style");
    el.id = "bs-badge-styles";
    el.textContent = `
.bs-badge{font-family:var(--font-sans);font-weight:var(--weight-medium);display:inline-flex;align-items:center;gap:4px;
  border-radius:var(--r-full);white-space:nowrap;line-height:1;font-feature-settings:var(--ot-ui);}
.bs-badge--sm{height:18px;padding:0 6px;font-size:11px;}
.bs-badge--md{height:22px;padding:0 8px;font-size:12px;}
.bs-badge .bs-badge__dot{width:6px;height:6px;border-radius:var(--r-full);background:currentColor;flex:none;}
.bs-badge svg,.bs-badge i{font-size:1em;flex:none;}
`;
    document.head.appendChild(el);
  }, []);
}

/* base color (text/accent) per semantic */
const BASE = {
  blue: "var(--state-information-base)",
  gray: "var(--state-faded-base)",
  green: "var(--state-success-base)",
  red: "var(--state-error-base)",
  amber: "var(--state-warning-base)",
  purple: "var(--state-feature-base)",
  sky: "var(--state-verified-base)",
};
const LIGHTER = {
  blue: "var(--state-information-lighter)",
  gray: "var(--state-faded-lighter)",
  green: "var(--state-success-lighter)",
  red: "var(--state-error-lighter)",
  amber: "var(--state-warning-lighter)",
  purple: "var(--state-feature-lighter)",
  sky: "var(--state-verified-lighter)",
};

/**
 * Badge — compact status pill (Verified, AAA, Pending…).
 */
export function Badge({
  color = "gray",
  variant = "light",
  size = "md",
  dot = false,
  leadingIcon,
  children,
  style,
  className = "",
  ...rest
}) {
  useBadgeStyles();
  let css = {};
  if (variant === "filled") {
    css = { background: BASE[color], color: "var(--text-on-brand)" };
  } else if (variant === "light") {
    css = { background: LIGHTER[color], color: BASE[color] };
  } else {
    // stroke
    css = {
      background: "transparent",
      color: BASE[color],
      boxShadow: `inset 0 0 0 1px ${BASE[color]}`,
    };
  }
  return (
    <span
      className={`bs-badge bs-badge--${size} ${className}`}
      style={{ ...css, ...style }}
      {...rest}
    >
      {dot && <span className="bs-badge__dot" />}
      {leadingIcon}
      {children}
    </span>
  );
}