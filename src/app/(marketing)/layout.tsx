import NavBar from "./_components/NavBar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface text-ink">
      <NavBar />
      <main className="pt-(--header-height)">
        <div>{children}</div>
      </main>
    </div>
  );
}
