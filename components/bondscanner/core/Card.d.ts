import * as React from "react";

/**
 * Card — standard white surface container with hairline stroke + soft shadow.
 *
 * @startingPoint section="Core" subtitle="Surface container with optional header" viewport="420x240"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional header title (Inter Display, h5). */
  title?: React.ReactNode;
  /** Optional subtitle under the title. */
  subtitle?: React.ReactNode;
  /** Optional right-aligned header action (e.g. a Button or link). */
  action?: React.ReactNode;
  /** Inner padding in px. Default 20. */
  padding?: number;
}
export function Card(props: CardProps): JSX.Element;
