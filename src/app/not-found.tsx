import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-sora text-5xl font-bold">404</p>
      <h1 className="font-sora text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button
        href="/"
        variant="primary"
        className="mt-2"
      >
        Back to home
      </Button>
    </div>
  );
}
