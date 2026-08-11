"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/bondscanner/core/Button";

// Where "Back" goes from each step of the journey.
const PREV: Record<string, string> = {
  "/rank": "/",
  "/rank/portfolio": "/rank",
  "/rank/leverage": "/rank/portfolio",
  "/rank/reveal": "/rank/leverage",
};

/**
 * Back control shown on every quest step. Uses the BondScanner ghost Button
 * (low-emphasis) and steps back one level based on the current route. Values
 * are preserved because the quest store persists to localStorage.
 */
export function QuestBack() {
  const pathname = usePathname();
  const router = useRouter();
  const prev = PREV[pathname];
  if (!prev) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      onClick={() => router.push(prev)}
      aria-label="Go back to the previous step"
    >
      <i className="ri-arrow-left-line text-xl" aria-hidden />
    </Button>
  );
}
