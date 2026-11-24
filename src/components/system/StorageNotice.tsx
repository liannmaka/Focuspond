"use client";

import { useTranslations } from "next-intl";
import { DatabaseZap } from "lucide-react";

import { useDatabaseStatus } from "@/lib/db/useDatabaseStatus";

/**
 * Says so when the app cannot reach its own storage.
 *
 * Everything in FocusPond lives in IndexedDB on the device. If it will not
 * open, the app is not slow — it is not working, and nothing below this can
 * tell the difference: live queries return `undefined` while loading and
 * `undefined` forever in this case, so the screen just shimmers.
 *
 * A band at the top of the work area rather than a dialog. The reader cannot
 * fix a browser setting from here, so blocking the screen would only take away
 * the little they can still do; what they need is to know that nothing they
 * type now is being kept.
 */
export default function StorageNotice() {
  const t = useTranslations("common.storage");
  const status = useDatabaseStatus();

  if (status === "opening" || status === "open") return null;

  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3"
    >
      <DatabaseZap
        className="mt-0.5 size-4 shrink-0 text-warning"
        aria-hidden
      />
      <div>
        <p className="font-sora text-sm font-semibold text-ink">
          {t(status === "blocked" ? "blocked.title" : "failed.title")}
        </p>
        <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
          {t(status === "blocked" ? "blocked.body" : "failed.body")}
        </p>
      </div>
    </div>
  );
}
