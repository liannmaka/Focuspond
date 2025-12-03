// # App shell with bottom nav and sidebar and top bar

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
