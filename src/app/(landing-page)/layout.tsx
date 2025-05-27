import NavBar from "./_components/NavBar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <main className="px-8 bg-base-background text-dark-accent">
        <div>{children}</div>
      </main>
    </div>
  );
}
