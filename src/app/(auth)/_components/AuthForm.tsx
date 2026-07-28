"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Button, Input, Label, FieldError } from "@/components/ui";

const baseShape = {
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
};

const LoginSchema = z.object(baseShape);
const SignupSchema = z.object({
  ...baseShape,
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name is too long" }),
});

type Mode = "login" | "signup";
type Values = z.infer<typeof SignupSchema>;

/**
 * Sign-in / sign-up UI.
 *
 * Validation is real; submission is not. `src/lib/auth/nextauth.ts` is still an
 * empty stub, so there is deliberately no submit handler and no network call —
 * the form says so plainly rather than pretending to sign anyone in. Wire the
 * provider first, then replace `onSubmit`.
 */
export default function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations("common.auth");
  const isSignup = mode === "signup";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Values>({
    resolver: zodResolver(isSignup ? SignupSchema : LoginSchema) as never,
    mode: "onTouched",
  });

  return (
    <div className="rounded-2xl border border-line bg-surface-raised p-7 shadow-e2">
      <h1 className="font-sora text-2xl font-semibold tracking-[-0.02em]">
        {t(`${mode}.title`)}
      </h1>
      <p className="mt-1.5 text-sm text-ink-muted">{t(`${mode}.subtitle`)}</p>

      <form
        onSubmit={handleSubmit(() => {})}
        className="mt-6 space-y-4"
        noValidate
      >
        {isSignup && (
          <div>
            <Label htmlFor="name">{t("fields.name")}</Label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t("fields.namePlaceholder")}
              invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <FieldError id="name-error">{errors.name.message}</FieldError>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="email">{t("fields.email")}</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("fields.emailPlaceholder")}
            invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <FieldError id="email-error">{errors.email.message}</FieldError>
          )}
        </div>

        <div>
          <Label htmlFor="password">{t("fields.password")}</Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={t("fields.passwordPlaceholder")}
            invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <FieldError id="password-error">
              {errors.password.message}
            </FieldError>
          )}
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-surface-sunken px-3 py-2.5 text-xs text-ink-muted">
          <Info
            className="mt-px size-3.5 shrink-0"
            aria-hidden
          />
          {t("notWired")}
        </p>

        <Button
          type="submit"
          size="sm"
          disabled={!isValid}
          className="w-full"
        >
          {t(`${mode}.submit`)}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        {t(`${mode}.altPrompt`)}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="link-animation font-medium text-accent-text"
        >
          {t(`${mode}.altLink`)}
        </Link>
      </p>

      <div className="mt-5 border-t border-line pt-4 text-center text-sm text-ink-subtle">
        {t("guest.prompt")}{" "}
        <Link
          href="/mood"
          className="link-animation font-medium text-ink-muted"
        >
          {t("guest.link")}
        </Link>
      </div>
    </div>
  );
}
