"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
};

/**
 * Shared UI for App Router `error.tsx` boundaries. Error boundaries must be
 * Client Components, so this file carries the "use client" directive and the
 * per-segment `error.tsx` files simply render it.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred. You can try again, or head back home.",
}) => {
  useEffect(() => {
    // Surface the error for observability (swap for a real logger later).
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-sora text-2xl font-semibold">{title}</h1>
      <p className="max-w-md text-sm text-neutral-500">{description}</p>
      <div className="mt-2 flex items-center gap-3">
        <Button
          onClick={reset}
          variant="primary"
        >
          Try again
        </Button>
        <Button
          href="/"
          variant="outline"
        >
          Go home
        </Button>
      </div>
    </div>
  );
};

export default ErrorFallback;
