"use client";

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
  const assets = useQuestStore((s) => s.assets);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  if (!hydrated) return <FormSkeleton />;

  const total = totalWealth(assets);

  const onContinue = () => {
    reachLevel(1);
    router.push("/rank/details");
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
    </div>
  );
}
