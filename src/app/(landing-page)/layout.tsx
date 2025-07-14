import { NavBar, Footer } from "./_components";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <main className="pt-[var(--header-height)]">
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
