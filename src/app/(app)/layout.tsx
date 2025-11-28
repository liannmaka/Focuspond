// # App shell with bottom nav

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
