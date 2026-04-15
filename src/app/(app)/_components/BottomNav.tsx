"use client";

import { tabs } from "@/data/web-app/navigation";
import { usePathname } from "next/navigation";
import BottomNavItem from "./BottomNavItem";

export default function BottomNav({className}: {className: string}) {
  const pathname = usePathname();

  return (
    // <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-dark-accent/15 z-50 shadow-[0_-2px_10px_rgba(139,94,60,0.08)] pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
    //   <div className="flex items-center justify-between h-16 px-4">
    //     {tabs.map(({ icon, href, label }) => {
    //       const Icon = icon;
    //       const isActiveRoute =
    //         pathname === href || pathname.startsWith(`$${href}/`);

    //       return (
    //         <BottomNavItem
    //           key={href}
    //           isActiveRoute={isActiveRoute}
    //           label={label}
    //           Icon={Icon}
    //           href={href}
    //         />
    //       );
    //     })}
    //   </div>
    // </nav>
    // h-16 = 64px
    <nav className={"bg-white/98"}>
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
