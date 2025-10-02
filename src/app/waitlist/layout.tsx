import { ReactNode } from "react";
import { NavBar } from "app/(landing-page)/_components";

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavBar />
      <main className="pt-[var(--header-height)]">{children}</main>
    </div>
  );
}
