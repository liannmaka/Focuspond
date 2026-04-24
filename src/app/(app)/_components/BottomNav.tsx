"use client";

import { tabs } from "@/data/web-app/navigation";
import { usePathname } from "next/navigation";
import BottomNavItem from "./BottomNavItem";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t border-dark-accent/15 h-16">
      <div className="flex items-center justify-between px-4">
        {tabs.map(({ icon, href, label }) => {
          const Icon = icon;
          const isActiveRoute =
            pathname === href || pathname.startsWith(`$${href}/`);

          return (
            <BottomNavItem
              key={href}
              isActiveRoute={isActiveRoute}
              label={label}
              Icon={Icon}
              href={href}
            />
          );
        })}
      </div>
    </nav>
  );
}
