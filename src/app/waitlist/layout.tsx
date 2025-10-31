import { ReactNode } from "react";
import NavBar from "app/(landing-page)/_components/NavBar";
import Footer from "app/(landing-page)/_components/Footer";

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavBar />
      <main className="pt-(--header-height)">{children}</main>
      <Footer />
    </div>
  );
}
