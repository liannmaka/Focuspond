"use client";

import { useEffect, useRef } from "react";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * A yes-or-no question about something that cannot be taken back.
 *
 * `role="alertdialog"`, not `dialog`: this interrupts to ask about a
 * consequence, which is the distinction the role exists for — a screen reader
 * announces the body text with it rather than waiting to be asked.
 *
 * **Cancel takes the focus**, not Confirm. The dangerous button should never be
 * one stray Enter away, and anyone who opened this by accident can leave it the
 * way they arrived. Escape and a click on the backdrop do the same thing, so
 * every obvious way out is the safe one.
 */
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-6"
      onClick={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) onCancel();
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className="w-full max-w-sm rounded-2xl border border-line bg-surface-raised p-6 shadow-e3"
      >
        <h2
          id="confirm-title"
          className="font-sora text-lg leading-snug font-semibold tracking-[-0.01em] text-ink"
        >
          {title}
        </h2>

        <p
          id="confirm-body"
          className="mt-2.5 text-sm leading-relaxed text-ink-muted"
        >
          {body}
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          {/*
            A plain button rather than `<Button>`: that component does not
            forward a ref, so the focus this dialog depends on silently never
            landed. Styled from the same `buttonVariants`, so it is the outline
            button in everything but its implementation.
          */}
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {cancelLabel}
          </button>

          {/*
            Rendered as a plain button rather than a `Button` variant: nothing
            in the design system is destructive yet, and inventing a `danger`
            variant for one caller would be a token nobody else uses.
          */}
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-danger/10 px-4 py-2.5 font-sora text-sm font-medium text-danger transition-colors hover:bg-danger/20"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
