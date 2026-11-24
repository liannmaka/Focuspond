"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { onWriteFailure } from "@/lib/db/writeGuard";

/**
 * Turns a failed write into something the reader can act on.
 *
 * Mounted once, at the root, and it renders nothing — it exists so the
 * database layer can report a failure without holding a message catalog, and
 * so every surface gets the same treatment without each one remembering to
 * ask. A write that fails on the Progress page deserves the same honesty as
 * one that fails on a task row.
 *
 * Why say anything at all: there is no server copy here, so a silent failure
 * does not degrade into a stale screen. The UI goes on showing the result it
 * assumed, and the work is gone at the next reload with nobody ever told.
 *
 * One toast at a time, by id: a storage failure usually arrives as several in
 * a burst — a save, then the retry, then whatever else was mid-flight — and a
 * stack of identical complaints is a worse way to learn one fact.
 */
export default function WriteFailureToaster() {
  const t = useTranslations("common.writeError");

  useEffect(
    () =>
      onWriteFailure((failure) => {
        toast.error(t("title", { what: t(`ops.${failure.operation}`) }), {
          description: failure.outOfSpace ? t("full") : t("body"),
          id: "write-failure",
          duration: 8000,
        });
      }),
    [t]
  );

  return null;
}
