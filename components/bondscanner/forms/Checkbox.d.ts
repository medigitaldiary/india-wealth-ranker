import * as React from "react";

/**
 * Checkbox — square toggle with optional inline label and indeterminate state.
 */
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean, e: React.ChangeEvent) => void;
  disabled?: boolean;
  /** Mixed/partial state (overrides the checkmark with a dash). */
  indeterminate?: boolean;
  /** Inline label node. */
  label?: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
