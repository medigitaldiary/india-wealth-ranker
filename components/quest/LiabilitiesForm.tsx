"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/bondscanner/core/Button";
import { AmountGroups } from "./AmountGroups";
import { NetWorthTicker } from "./NetWorthTicker";
import { FormSkeleton } from "./FormSkeleton";
import { LIABILITY_GROUPS } from "@/lib/wealth/inputs";
import { netWorth } from "@/lib/wealth/calculate";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";

export function LiabilitiesForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const fullName = useQuestStore((s) => s.fullName);
  const highestLevel = useQuestStore((s) => s.highestLevel);
  const assets = useQuestStore((s) => s.assets);
  const liabilities = useQuestStore((s) => s.liabilities);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  // Funnel guard: must have reached Level 2 (assets) first.
  useEffect(() => {
    if (hydrated && (!fullName || highestLevel < 2)) router.replace("/rank");
  }, [hydrated, fullName, highestLevel, router]);

  if (!hydrated) return <FormSkeleton />;

  const net = netWorth(assets, liabilities);

  const onContinue = () => {
    reachLevel(3);
    router.push("/rank/reveal");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-[76px] z-[5]">
        <NetWorthTicker value={net} label="Your net worth" tone="auto" />
      </div>

      <AmountGroups groups={LIABILITY_GROUPS} kind="liabilities" />

      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        trailingIcon={<i className="ri-sparkling-2-line text-lg" aria-hidden />}
      >
        Reveal my rank
      </Button>
      <p
        className="text-center text-text-muted"
        style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--body-xs-line)" }}
      >
        Almost there. Your net worth is ready to be ranked.
      </p>
    </div>
  );
}
