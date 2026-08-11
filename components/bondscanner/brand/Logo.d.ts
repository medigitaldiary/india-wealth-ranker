import * as React from "react";

/**
 * BondScanner logo lockup — compass mark + wordmark, color-adapted per surface.
 *
 * @startingPoint section="Brand" subtitle="Logo lockup & mark" viewport="360x120"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color treatment for the background it sits on.
   *  primary/light → blue badge + white mark; inverse/dark → white badge + blue mark + white wordmark. */
  variant?: "primary" | "light" | "inverse" | "dark";
  /** Badge diameter in px; wordmark & mark scale from this. Default 40. */
  size?: number;
  /** Show the "BondScanner" wordmark next to the badge. Default true. */
  showWordmark?: boolean;
}
export function Logo(props: LogoProps): JSX.Element;

export interface LogoMarkProps extends React.SVGAttributes<SVGSVGElement> {
  /** Glyph size in px. Default 32. */
  size?: number;
  /** Any CSS color for the mark fill. Default var(--brand). */
  color?: string;
}
/** The bare compass glyph, no circular badge. */
export function LogoMark(props: LogoMarkProps): JSX.Element;
