import * as React from "react";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional trailing count/badge. */
  badge?: React.ReactNode;
}

/**
 * Tabs — underline segmented navigation for switching views within a page.
 *
 * @startingPoint section="Navigation" subtitle="Underline tab bar" viewport="560x120"
 */
export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  /** Controlled active value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
}
export function Tabs(props: TabsProps): JSX.Element;
