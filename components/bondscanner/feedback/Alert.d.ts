import * as React from "react";

/**
 * Alert — inline notification banner (info / success / warning / error).
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic color + default icon. Default "info". */
  variant?: "info" | "success" | "warning" | "error";
  /** Bold lead line. */
  title?: React.ReactNode;
  /** Override the default icon with a custom node. */
  icon?: React.ReactNode;
  /** Surface treatment. Default "soft" (tinted); "outline" = white + stroke. */
  fill?: "soft" | "outline";
  /** Show a dismiss button; called on click. */
  onClose?: () => void;
}
export function Alert(props: AlertProps): JSX.Element;
