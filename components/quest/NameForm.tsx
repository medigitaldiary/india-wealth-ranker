"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/bondscanner/forms/Input";
import { Button } from "@/components/bondscanner/core/Button";
import { nameSchema, type NameInput } from "@/lib/validation/schemas";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";

export function NameForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const highestLevel = useQuestStore((s) => s.highestLevel);
  const setName = useQuestStore((s) => s.setName);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  // Funnel guard: must have entered wealth (step 1) first.
  useEffect(() => {
    if (hydrated && highestLevel < 1) router.replace("/rank");
  }, [hydrated, highestLevel, router]);

  const { control, handleSubmit } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    mode: "onTouched",
    defaultValues: { firstName: "", lastName: "" },
  });

  if (!hydrated) return null;

  const onSubmit = (data: NameInput) => {
    setName({ firstName: data.firstName.trim(), lastName: data.lastName.trim() });
    reachLevel(2);
    router.push("/rank/verify");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Input
              label="First name"
              required
              size="lg"
              placeholder="Aarav"
              leadingIcon={<i className="ri-user-line" aria-hidden />}
              autoComplete="given-name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={!!fieldState.error}
              hint={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <Input
              label="Last name"
              required
              size="lg"
              placeholder="Sharma"
              leadingIcon={<i className="ri-user-line" aria-hidden />}
              autoComplete="family-name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={!!fieldState.error}
              hint={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        trailingIcon={<i className="ri-arrow-right-line text-lg" aria-hidden />}
      >
        Continue
      </Button>
    </form>
  );
}
