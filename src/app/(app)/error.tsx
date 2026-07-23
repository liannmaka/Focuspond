"use client";

import ErrorFallback from "@/components/ui/ErrorFallback";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      description="We hit a snag loading this part of your workspace. Try again, or go home."
    />
  );
}
