"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/bondscanner/core/Button";
import { AmountGroups } from "./AmountGroups";
import { NetWorthTicker } from "./NetWorthTicker";
import { FormSkeleton } from "./FormSkeleton";
import { ASSET_GROUPS } from "@/lib/wealth/inputs";
import { totalAssets } from "@/lib/wealth/calculate";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";

export function AssetsForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const fullName = useQuestStore((s) => s.fullName);
  const assets = useQuestStore((s) => s.assets);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  // Funnel guard: must complete Level 1 first.
  useEffect(() => {
    if (hydrated && !fullName) router.replace("/rank");
  }, [hydrated, fullName, router]);

  if (!hydrated) return <FormSkeleton />;

  const total = totalAssets(assets);

  const onContinue = () => {
    reachLevel(2);
    router.push("/rank/leverage");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-[76px] z-[5]">
        <NetWorthTicker value={total} label="Assets so far" />
      </div>

      <AmountGroups groups={ASSET_GROUPS} kind="assets" />

      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        trailingIcon={<i className="ri-arrow-right-line text-lg" aria-hidden />}
      >
        Continue to liabilities
      </Button>
      <p
        className="text-center text-text-muted"
        style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--body-xs-line)" }}
      >
        Don&apos;t have something? Just leave it blank.
      </p>
    </div>
  );
}
