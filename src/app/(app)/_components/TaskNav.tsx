"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { tabs } from "@/data/web-app/navigation";
import { useTaskCounts } from "@/features/tasks/hooks/useTasks";

export default function TaskNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const counts = useTaskCounts();

  return (
    <div>
      {tabs.map(({ href, key, icon: Icon }) => {
        const isActive = pathname === href;
        const count = counts?.[key];

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`my-2
    flex items-center gap-3.5 py-3.5 px-6 relative
    transition-colors duration-150
    ${
      isActive
        ? "bg-ink/5 text-ink"
        : "text-ink/80 hover:bg-ink/5 hover:text-ink"
    }
  `}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-accent to-accent/80 shadow-sm" />
            )}
            <Icon
              className="w-4 h-4"
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            <span
              className={`text-sm font-manrope ${isActive ? "font-semibold" : "font-medium"}`}
            >
              {t(`tabs.${key}`)}
            </span>

            {/* Zero is not worth the ink — an empty group reads as calm. */}
            {count !== undefined && count > 0 && (
              <span className="ml-auto font-sora text-[11px] font-semibold tabular-nums text-ink-subtle">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
