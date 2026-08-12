"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/bondscanner/forms/Input";
import { Button } from "@/components/bondscanner/core/Button";
import { nameSchema, type NameInput } from "@/lib/validation/schemas";
import { useQuestStore } from "@/lib/store/questStore";

export function NameForm() {
  const router = useRouter();
  const setName = useQuestStore((s) => s.setName);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  const { control, handleSubmit } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    mode: "onTouched",
    defaultValues: { firstName: "", lastName: "" },
  });

  const onSubmit = (data: NameInput) => {
    setName({ firstName: data.firstName.trim(), lastName: data.lastName.trim() });
    reachLevel(1);
    router.push("/rank/portfolio");
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
