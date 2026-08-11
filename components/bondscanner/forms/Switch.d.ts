import * as React from "react";

/**
 * Switch — boolean toggle (controlled or uncontrolled).
 */
export interface SwitchProps {
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Fires with the next boolean value. */
  onChange?: (next: boolean, e: React.MouseEvent) => void;
  disabled?: boolean;
  /** Default "md". */
  size?: "sm" | "md";
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): JSX.Element;
