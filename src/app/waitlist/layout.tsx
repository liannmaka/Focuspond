import { ReactNode } from "react";
import { NavBar, Footer } from "app/(landing-page)/_components";

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavBar />
      <main className="pt-[var(--header-height)]">{children}</main>
      <Footer />
    </div>
  );
}
