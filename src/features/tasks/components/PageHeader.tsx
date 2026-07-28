"use client";

import { useTranslations } from "next-intl";

type PageHeaderProps = {
  title: string;
  done?: number;
  total?: number;
};

/**
 * The display-scale heading the app pages never had. Its absence — everything
 * sitting between 11px and 14px — is a large part of why these screens read as
 * a list rather than a product.
 */
export default function PageHeader({ title, done, total }: PageHeaderProps) {
  const t = useTranslations("tasks.page");
  const showProgress = typeof done === "number" && typeof total === "number";
  const pct = showProgress && total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <header className="mb-7 flex items-end justify-between gap-6">
      <div>
        <p
          className="mb-1.5 font-sora text-[10.5px] font-bold tracking-[0.1em] text-ink-subtle uppercase"
          // Formatted from the reader's own clock and timezone, so the server
          // render legitimately differs from the client's.
          suppressHydrationWarning
        >
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="font-sora text-2xl font-semibold tracking-[-0.02em] text-ink md:text-[1.75rem]">
          {title}
        </h1>
      </div>

      {showProgress && total > 0 && (
        <div className="shrink-0 text-right">
          <p className="font-sora text-sm font-semibold tabular-nums text-ink">
            {done} / {total}
          </p>
          <div
            className="mt-1.5 h-[3px] w-23 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={t("progress", { done, total })}
          >
            <span
              className="block h-full rounded-full bg-success transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
