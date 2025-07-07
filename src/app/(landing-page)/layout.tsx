import NavBar from "./_components/NavBar";
import Footer from "./_components/Footer";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <main className="pt-[var(--header-height)] container mx-auto">
        <div>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
