"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/bondscanner/core/Button";
import { AmountGroups } from "./AmountGroups";
import { NetWorthTicker } from "./NetWorthTicker";
import { FormSkeleton } from "./FormSkeleton";
import { totalWealth } from "@/lib/wealth/calculate";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";

export function AssetsForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const firstName = useQuestStore((s) => s.firstName);
  const assets = useQuestStore((s) => s.assets);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  // Funnel guard: must have entered a name first.
  useEffect(() => {
    if (hydrated && !firstName) router.replace("/rank");
  }, [hydrated, firstName, router]);

  if (!hydrated) return <FormSkeleton />;

  const total = totalWealth(assets);

  const onContinue = () => {
    reachLevel(2);
    router.push("/rank/verify");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-[76px] z-[5]">
        <NetWorthTicker value={total} label="Total wealth" />
      </div>

      <AmountGroups />

      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        trailingIcon={<i className="ri-arrow-right-line text-lg" aria-hidden />}
      >
        Continue
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
