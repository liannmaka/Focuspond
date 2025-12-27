import BottomNav from "../_components/BottomNav";
import SideBar from "../_components/SideBar";
import TopBar from "../_components/TopBar";

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-background/10">
      {/* DESKTOP: Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* MOBILE: Bottom Nav */}
      <BottomNav />
    </div>
  );
}
