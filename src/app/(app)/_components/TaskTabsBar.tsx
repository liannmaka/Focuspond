"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { tabs } from "@/data/web-app/navigation";
import { useTaskCounts } from "@/features/tasks/hooks/useTasks";

/**
 * The task filters, on mobile.
 *
 * They used to be the bottom bar, which was the only reason a phone could
 * reach them — and the reason it could not reach Progress, Mood or free focus,
 * since the rail that holds those is `hidden lg:grid`. The bottom bar now
 * mirrors the rail, so the filters needed somewhere of their own.
 *
 * Here, above the list, is where they belong anyway: they narrow what is on
 * screen rather than taking you somewhere else, and a control that changes a
 * list reads better beside the list than at the foot of the window.
 *
 * On desktop this is hidden, because `TaskNav` in the detail panel already
 * does the job with room to spare.
 */
export default function TaskTabsBar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const counts = useTaskCounts();

  // Task pages only. The focus screen is under /home and is emphatically not
  // one: a filter row above a running clock would be an invitation to leave.
  const onTaskPage =
    pathname.startsWith("/home") && !pathname.startsWith("/home/timer");

  if (!onTaskPage) return null;

  return (
    <nav
      aria-label={t("filters.heading")}
      className="-mx-6 mb-6 lg:hidden"
    >
      {/* Scrollable rather than wrapped: five chips and a count do not fit on
          a narrow phone, and a second row would push the list itself down. */}
      <ul className="flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ href, key }) => {
          const isActive = pathname === href;
          const count = counts?.[key];

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sora text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-accent/40 bg-accent/10 text-accent-text"
                    : "border-line bg-surface-raised text-ink-muted"
                }`}
              >
                {t(`tabs.${key}`)}
                {/* A space, so the accessible name reads "Backlog 1" rather
                    than "Backlog1". Whitespace-only nodes are not rendered as
                    flex items, so nothing moves. */}{" "}
                {/* Zero is not worth the ink — an empty group reads as calm. */}
                {count !== undefined && count > 0 && (
                  <span className="font-sora text-[11px] tabular-nums opacity-70">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
