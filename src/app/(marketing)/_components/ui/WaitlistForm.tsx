"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FieldError } from "@/components/ui";

/**
 * Built with the translated message rather than a literal, so the one piece
 * of copy a reader is most likely to see — the error on their own typo —
 * is not the only English left on a localised page.
 */
const waitFormSchema = (invalid: string) =>
  z.object({
    email: z.email({ message: invalid }),
    honeypot: z.string().optional(),
  });

type FormValues = z.infer<ReturnType<typeof waitFormSchema>>;

type SubmitButtonProps = {
  isSubmitting: boolean;
  isValid: boolean;
  label: string;
};

const SubmitButton = ({ isSubmitting, isValid, label }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      // No aria-label: the visible label is already the accessible name, and
      // overriding it with "Submit waitlist" broke voice control — a spoken
      // command matches what is on screen, not what was announced. This one
      // was real; the four the roadmap flagged were passed to `<Button>`,
      // which drops them (see its `ariaLabel` note).
      disabled={isSubmitting || !isValid}
      className="font-sora cursor-pointer bg-accent hover:bg-accent-hover px-4 py-2.5 rounded-full m-2 text-accent-ink relative overflow-hidden font-medium group ring-4 ring-surface shadow-e1 disabled:opacity-50 disabled:cursor-not-allowed min-w-28"
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

const WaitlistForm = () => {
  const t = useTranslations("marketing.waitlist.form");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(waitFormSchema(t("invalid"))),
    defaultValues: { email: "", honeypot: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json?.message || t("failure"));
      }

      reset();
      toast.success(json.message || t("success"));
    } catch (err: unknown) {
      console.error("Waitlist submit error:", err);

      const message = err instanceof Error ? err.message : t("failure");

      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xs mx-auto"
    >
      <div className="block mb-2">
        <div className="text-xs flex w-full rounded-full overflow-hidden border border-line bg-surface-raised font-manrope focus-within:border-accent">
          <input
            {...register("email")}
            type="email"
            name="email"
            placeholder={t("placeholder")}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "waitlist-email-error" : undefined}
            className="flex-1 px-4 py-3 bg-transparent text-ink placeholder:text-ink-subtle focus:outline-none placeholder:text-xs"
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            isValid={isValid}
            label={isSubmitting ? t("submitting") : t("submit")}
          />
        </div>
        {errors.email && (
          <FieldError id="waitlist-email-error">
            {errors.email.message}
          </FieldError>
        )}
      </div>

      {/* honeypot — visually hidden */}
      <label
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <span>Leave this empty</span>
        <input
          {...register("honeypot")}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </form>
  );
};

export default WaitlistForm;
