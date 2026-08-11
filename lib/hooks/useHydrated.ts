"use client";

import { useEffect, useState } from "react";

/**
 * True only after the component has mounted on the client. Use to gate
 * rendering of persisted (localStorage-backed) store values so SSR output
 * (empty store) doesn't mismatch the hydrated client render.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
