import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Consolidates the three unrelated input treatments that were scattered across
 * the contact form, the waitlist pill, and the TopBar search. Focus is a real
 * ring, not `outline-none` with nothing in its place.
 */
const fieldStyles =
  "w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 font-manrope text-sm text-ink transition-colors placeholder:text-ink-subtle hover:border-line-strong focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/30";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Renders the danger border/ring and marks the field for assistive tech. */
  invalid?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...rest }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldStyles, className)}
      {...rest}
    />
  )
);
Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...rest }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldStyles, "resize-y", className)}
      {...rest}
    />
  )
);
Textarea.displayName = "Textarea";

/** Field label — pair with an `id`/`htmlFor` on the control. */
const Label = ({
  className,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn(
      "mb-1.5 block font-manrope text-sm font-medium text-ink",
      className
    )}
    {...rest}
  />
);

/** Validation message. Give it an `id` and point `aria-describedby` at it. */
const FieldError = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    role="alert"
    className={cn("mt-1 font-manrope text-xs text-danger", className)}
    {...rest}
  />
);

export { Input, Textarea, Label, FieldError, fieldStyles };
export default Input;
