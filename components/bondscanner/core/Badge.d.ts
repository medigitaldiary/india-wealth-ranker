import * as React from "react";

/**
 * Badge — compact status pill for ratings, states, and counts.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic hue. Default "gray". */
  color?: "blue" | "gray" | "green" | "red" | "amber" | "purple" | "sky";
  /** Fill treatment. Default "light". */
  variant?: "filled" | "light" | "stroke";
  /** Default "md". */
  size?: "sm" | "md";
  /** Show a leading status dot in the current color. */
  dot?: boolean;
  /** Optional leading icon node. */
  leadingIcon?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
