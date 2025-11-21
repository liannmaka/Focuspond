export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}
