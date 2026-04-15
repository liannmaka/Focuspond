import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import SideBar from "../_components/Sidebar";

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[98px_1fr_64px] h-screen">
      {/* Top Bar */}
      <TopBar className="" />

      {/* DESKTOP: Sidebar */}
      <SideBar />

      {/* Page Content */}
      <main className="px-6 py-7 bg-base-background overflow-y-auto">{children}</main>

      {/* MOBILE: Bottom Nav */} 
      <div className="lg:hidden">
        <BottomNav className="" />
      </div> 
    </div>
  );
}
