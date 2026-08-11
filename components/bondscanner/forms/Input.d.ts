import * as React from "react";

/**
 * Input — labelled text field with hint, validation state, and icon slots.
 *
 * @startingPoint section="Forms" subtitle="Text fields, switches & checkboxes" viewport="700x320"
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper or error text below the control. */
  hint?: React.ReactNode;
  /** Show a required asterisk on the label. */
  required?: boolean;
  /** Error styling (red border + hint). */
  error?: boolean;
  disabled?: boolean;
  /** Default "md". */
  size?: "sm" | "md" | "lg";
  /** Leading icon node (e.g. Remix <i>). */
  leadingIcon?: React.ReactNode;
  /** Trailing node — icon, unit, or small button. */
  trailing?: React.ReactNode;
}
export function Input(props: InputProps): JSX.Element;
