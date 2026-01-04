// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Calendar,
//   CalendarDays,
//   Inbox,
//   CheckCircle,
//   Settings,
//   LogOut,
//   User,
//   LayoutGrid,
// } from "lucide-react";

// export default function SideBar() {
//   const pathname = usePathname();

//   const mainNavItems = [
//     { href: "/dashboard/all", label: "All Tasks", icon: LayoutGrid },
//     { href: "/dashboard/today", label: "Today", icon: Calendar },
//     { href: "/dashboard/week", label: "This Week", icon: CalendarDays },
//     { href: "/dashboard/backlog", label: "Backlog", icon: Inbox },
//     { href: "/dashboard/completed", label: "Completed", icon: CheckCircle },
//   ];

//   const bottomNavItems = [
//     { href: "/dashboard/settings", label: "Settings", icon: Settings },
//     { href: "/dashboard/profile", label: "Profile", icon: User },
//   ];

//   return (
//     <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex-col z-40">
//       {/* Logo/Brand */}
//       <div className="p-6 border-b border-gray-100">
//         <Link
//           href="/dashboard"
//           className="flex items-center gap-3 group"
//         >
//           <div className="w-10 h-10 rounded-xl bg-linear-to-br from-accent-button to-secondary-accent flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
//             <span className="text-xl">🌼</span>
//           </div>
//           <span className="text-xl font-bold bg-linear-to-r from-dark-accent to-dark-accent/80 bg-clip-text text-transparent">
//             FocusPond
//           </span>
//         </Link>
//       </div>

//       {/* Main Navigation */}
//       <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
//         {mainNavItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.href;

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`
//                 flex items-center gap-3 px-4 py-3 rounded-xl
//                 transition-all duration-200 group
//                 ${
//                   isActive
//                     ? "bg-linear-to-r from-accent-button to-accent-button/90 text-white shadow-md shadow-accent-button/20"
//                     : "text-gray-600 hover:bg-gray-50 hover:text-dark-accent"
//                 }
//               `}
//             >
//               <Icon
//                 className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`}
//                 strokeWidth={isActive ? 2.5 : 2}
//               />
//               <span className={isActive ? "font-semibold" : "font-medium"}>
//                 {item.label}
//               </span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom Actions */}
//       <div className="p-3 border-t border-gray-100 space-y-1">
//         {bottomNavItems.map((item) => {
//           const Icon = item.icon;

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-dark-accent transition-all font-medium group"
//             >
//               <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
//               <span>{item.label}</span>
//             </Link>
//           );
//         })}

//         <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium group">
//           <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

export default function SideBar() {
  return <div>hello world</div>;
}
