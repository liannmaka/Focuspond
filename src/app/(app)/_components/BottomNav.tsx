"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { sectionFor, sections } from "@/data/web-app/navigation";
import BottomNavItem from "./BottomNavItem";

/**
 * The mobile navigation, and below `lg` the only navigation there is.
 *
 * It used to carry the five task filters — All, Today, Upcoming, Backlog,
 * Done — which left Progress, Mood and a free focus session unreachable on a
 * phone: those live in the icon rail, and the rail is `hidden lg:grid`.
 *
 * So it mirrors the rail instead, from the same `sections` and the same
 * `sectionFor`. The task filters did not disappear with it; they moved to a
 * row on the task pages themselves (`TaskTabsBar`), which is where a filter
 * belongs — it narrows what is on screen rather than taking you somewhere.
 */
export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav.bottom");
  const current = sectionFor(pathname);

  return (
    <nav className="h-16 border-t border-line bg-surface-overlay">
      <div className="flex items-center justify-between px-4">
        {sections.map(({ href, key, section, icon }) => (
          <BottomNavItem
            key={href}
            isActiveRoute={current === section}
            label={t(key)}
            Icon={icon}
            href={href}
          />
        ))}
      </div>
    </nav>
  );
}
