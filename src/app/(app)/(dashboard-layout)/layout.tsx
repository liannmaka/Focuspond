import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import SideBar from "../_components/Sidebar";

// export default function PwaLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="grid grid-rows-[98px_1fr_64px] h-screen">
//       {/* Top Bar */}
//       <TopBar className="" />

//       {/* DESKTOP: Sidebar */}
//       <SideBar />

//       {/* Page Content */}
//       <main className="px-6 py-7 bg-base-background overflow-y-auto">{children}</main>

//       {/* MOBILE: Bottom Nav */} 
//       <div className="lg:hidden">
//         <BottomNav/>
//       </div> 
//     </div>
//   );
// }

export default function PwaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Top bar */}
      <TopBar />

      {/* Main Layout Area */}
      <div className="min-h-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid h-full grid-cols-[56px_235px_minmax(0,1fr)]">
          <SideBar />

          <main className="overflow-y-auto bg-base-background px-6 py-7">
            {children}
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden h-full grid grid-rows-[1fr_64px]">
          <main className="overflow-y-auto bg-base-background px-6 py-7">
            {children}
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}
