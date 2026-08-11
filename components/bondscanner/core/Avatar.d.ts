import * as React from "react";

/**
 * Avatar — circular user/company image with initials fallback + status dot.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL; when omitted, `initials` render on a tinted background. */
  src?: string;
  alt?: string;
  /** Monogram fallback, e.g. "AK". */
  initials?: string;
  /** Default "md". */
  size?: "xs" | "sm" | "md" | "lg";
  /** Initials tint when no image. Default "blue". */
  color?: "blue" | "gray" | "green" | "purple" | "amber";
  /** Optional presence dot. */
  status?: "online" | "away" | "busy" | "offline";
}
export function Avatar(props: AvatarProps): JSX.Element;
