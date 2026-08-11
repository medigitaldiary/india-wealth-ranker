import * as React from "react";

/**
 * Button — primary action element. Use `primary` for the main CTA on a view,
 * `secondary` for adjacent actions, `ghost` for low-emphasis, `danger` for
 * destructive. Renders an <a> when `href` is set.
 *
 * @startingPoint section="Core" subtitle="Buttons — variants, sizes, icons" viewport="700x220"
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. Default "primary". */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
  /** Height/padding. Default "md". */
  size?: "sm" | "md" | "lg";
  /** Square icon-only button (pass a single icon as children). */
  iconOnly?: boolean;
  /** Icon node rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Icon node rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Render as an anchor with this href instead of a <button>. */
  href?: string;
}
export function Button(props: ButtonProps): JSX.Element;
