"use client";

import { useEffect } from "react";
import { useQuestStore } from "@/lib/store/questStore";

/**
 * Clears the quest store when the landing page mounts, so starting over (or a
 * new player returning to the home page) always begins with a blank slate.
 */
export function ResetQuest() {
  const reset = useQuestStore((s) => s.reset);
  useEffect(() => {
    reset();
  }, [reset]);
  return null;
}
