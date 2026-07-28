"use client";

import { tabs } from "@/data/web-app/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import BottomNavItem from "./BottomNavItem";

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav.tabs");

  return (
    <nav className="bg-surface-overlay border-t border-line h-16">
      <div className="flex items-center justify-between px-4">
        {tabs.map(({ icon, href, key }) => {
          const Icon = icon;
          const isActiveRoute =
            pathname === href || pathname.startsWith(`$${href}/`);

          return (
            <BottomNavItem
              key={href}
              isActiveRoute={isActiveRoute}
              label={t(key)}
              Icon={Icon}
              href={href}
            />
          );
        })}
      </div>
    </nav>
  );
}
