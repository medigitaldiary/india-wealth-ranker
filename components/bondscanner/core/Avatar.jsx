"use client";
import React from "react";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48 };

/**
 * Avatar — circular user/company image with optional initials fallback and a
 * status dot. Pass `src` for a photo or `initials` for a tinted monogram.
 */
export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  color = "blue",
  status,
  style,
  className = "",
  ...rest
}) {
  const px = SIZES[size] || SIZES.md;
  const tint = {
    blue: ["var(--blue-50)", "var(--blue-700)"],
    gray: ["var(--gray-100)", "var(--gray-600)"],
    green: ["var(--emerald-50)", "var(--emerald-700)"],
    purple: ["var(--purple-50)", "var(--purple-700)"],
    amber: ["var(--amber-50)", "var(--amber-700)"],
  }[color] || ["var(--blue-50)", "var(--blue-700)"];

  const statusColor = {
    online: "var(--state-success-base)",
    away: "var(--state-away-base)",
    busy: "var(--state-error-base)",
    offline: "var(--state-faded-base)",
  }[status];

  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-flex", flex: "none", ...style }}
      {...rest}
    >
      <span
        style={{
          width: px,
          height: px,
          borderRadius: "var(--r-full)",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: tint[0],
          color: tint[1],
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--weight-medium)",
          fontSize: Math.round(px * 0.38),
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          initials
        )}
      </span>
      {statusColor && (
        <span
          style={{
            position: "absolute",
            right: -1,
            bottom: -1,
            width: Math.max(8, Math.round(px * 0.26)),
            height: Math.max(8, Math.round(px * 0.26)),
            borderRadius: "var(--r-full)",
            background: statusColor,
            boxShadow: "0 0 0 2px var(--surface-card)",
          }}
        />
      )}
    </span>
  );
}