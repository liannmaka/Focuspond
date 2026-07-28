"use client";

import { usePathname } from "next/navigation";
import { Settings, House, Sun, ChartNoAxesCombined } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

import DashboardPanel from "../_layouts/DashboardPanel";
import IconButton from "./IconButton";

const getCurrentSection = (pathname: string) => {
  if (pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/mood")) return "mood";
  return "others";
};

const PRIMARY_NAV_ITEMS = [
  { icon: House, href: "/home/all", tab: "home" },
  { icon: ChartNoAxesCombined, href: "/analytics", tab: "analytics" },
  // /tools was here and routed to a page that has never existed. /mood is the
  // real third destination.
  { icon: Sun, href: "/mood", tab: "mood" },
];

export default function SideBar() {
  const pathname = usePathname();

  const currentSection = getCurrentSection(pathname);

  return (
    <>
      <IconRail currentSection={currentSection} />
      {currentSection === "home" && <DetailPanel />}
    </>
  );
}

const IconRail = memo(({ currentSection }: { currentSection: string }) => {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="h-full border-r border-line px-2 py-2 flex flex-col justify-between bg-surface-overlay">
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
    <div className="h-full border-r border-dark-accent/15">
      <DashboardPanel />
    </div>
  );
};
