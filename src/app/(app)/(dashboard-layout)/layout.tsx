import StorageNotice from "@/components/system/StorageNotice";
import TaskTabsBar from "../_components/TaskTabsBar";
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
        {/*
          Desktop Layout.

          The middle column is `auto`, not a fixed 235px, and `main` is placed
          in column 3 explicitly. Both matter: the detail panel renders only in
          the task section, and with a fixed column and automatic placement,
          `main` slid into the panel's slot on every other page and rendered it
          235px wide — which is what `/analytics` has been doing. `auto`
          collapses the column to nothing when the panel is absent, and the
          explicit column keeps `main` out of it when it is present.

          The panel's own width lives on the panel (see Sidebar), where a thing
          that has a width should carry it.
        */}
        <div className="hidden h-full grid-cols-[56px_auto_minmax(0,1fr)] lg:grid">
          <SideBar />

          <main className="col-start-3 overflow-y-auto bg-surface px-6 py-8 md:px-10 md:py-12">
            <StorageNotice />
            {children}
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden h-full grid grid-rows-[1fr_64px]">
          <main className="overflow-y-auto bg-surface px-6 py-8 md:px-10 md:py-12">
            <StorageNotice />
            <TaskTabsBar />
            {children}
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
