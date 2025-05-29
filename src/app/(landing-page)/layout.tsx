import NavBar from "./_components/NavBar";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <main className="pt-[69px] px-8">
        <div>{children}</div>
      </main>
    </div>
  );
}
