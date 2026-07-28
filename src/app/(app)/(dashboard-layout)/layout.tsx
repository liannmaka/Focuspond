import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import SideBar from "../_components/Sidebar";

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Top bar */}
      <TopBar />

      {/* Main Layout Area */}
      <div className="min-h-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid h-full grid-cols-[56px_235px_minmax(0,1fr)]">
          <SideBar />

          <main className="overflow-y-auto bg-surface px-6 py-8 md:px-10 md:py-12">
            {children}
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden h-full grid grid-rows-[1fr_64px]">
          <main className="overflow-y-auto bg-surface px-6 py-8 md:px-10 md:py-12">
            {children}
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
