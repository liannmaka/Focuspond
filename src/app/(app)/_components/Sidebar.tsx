"use client";

import { usePathname } from "next/navigation";
import {
  Settings,
  Layers,
  House,
  Sun,
  ChartNoAxesCombined,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

import DashboardPanel from "../_layouts/DashboardPanel";
import IconButton from "./IconButton";

const getCurrentSection = (pathname: string) => {
  if (pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/analytics")) return "analytics";
  return "others";
};

const PRIMARY_NAV_ITEMS = [
  { icon: House, href: "/home/all", tab: "home" },
  { icon: ChartNoAxesCombined, href: "/analytics", tab: "analytics" },
  { icon: Layers, href: "/tools", tab: "tools" },
];

export default function SideBar() {
  const pathname = usePathname();

  const currentSection = getCurrentSection(pathname);

  return (
    // <aside className="hidden md:flex fixed left-0 top-14 h-[calc(100vh-env(safe-area-inset-top)-3.5rem)] border-t border-dark-accent/15 flex-col z-40 bg-white/98">
    //   <div className="flex h-full w-full">
    //     <IconRail currentSection={currentSection} />
    //     {currentSection === "home" && <DetailPanel />}
    //   </div>
    // </aside>
    <aside className="hidden bg-white/98">
      <div className="flex h-full w-full">
        <IconRail currentSection={currentSection} />
        {currentSection === "home" && <DetailPanel />}
      </div>
    </aside>
  );
}

const IconRail = memo(({ currentSection }: { currentSection: string }) => {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="w-14 border-r border-dark-accent/15 px-2 py-2 flex flex-col justify-between bg-linear-to-b from-white to-base-background/30">
      <div className="space-y-1">
        {PRIMARY_NAV_ITEMS.map(({ icon, href, tab }) => (
          <IconButton
            key={tab}
            icon={icon}
            isActive={currentSection === tab}
            onClick={() => handleNavigation(href)}
          />
        ))}
      </div>

      <div className="space-y-1">
        {/* divider */}
        <div className="h-px bg-dark-accent/20 mx-1.5 mb-2" />
        <IconButton icon={Sun} />
        <IconButton icon={Settings} />
      </div>
    </nav>
  );
});

IconRail.displayName = "IconRail";

const DetailPanel = () => {
  return (
    <div className="w-[235px] border-r border-dark-accent/15">
      <DashboardPanel />
    </div>
  );
};
