"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Accessible name — required, since the control renders no text of its own. */
  label: string;
  disabled?: boolean;
  className?: string;
};

/**
 * The round task checkbox. This is the most-repeated interaction in FocusPond,
 * so it gets a real rest / hover / checked treatment rather than being inlined
 * again per surface.
 *
 * Rendered as a `button role="checkbox"` so the hit area, the ring, and the
 * check animation are all ours — a native input can't be styled to this.
 */
export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] transition-all duration-150",
        checked
          ? "border-success bg-success"
          : "border-line-strong hover:border-ink-muted",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <Check
        className={cn(
          "size-3 transition-[opacity,transform] duration-150",
          // The tick sits on the success fill, so it takes the raised surface
          // colour rather than a hardcoded white.
          checked
            ? "scale-100 text-surface-raised opacity-100"
            : "scale-50 opacity-0"
        )}
        strokeWidth={3}
        aria-hidden
      />
    </button>
  );
}
